from channels.db import database_sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from authentication.models import User
from .models import FriendRequest
import logging
from rest_framework.authtoken.models import Token


logger = logging.getLogger(__name__)

#todo: using self.user check if the sender is always the user, maybe add sender and target to response request, to add this feature and to be consistent
class ChatConsumer(AsyncWebsocketConsumer):
	
	async def connect(self):
		query_params = self.scope['query_string'].decode()
		if 'token=' in query_params:
			token_key = query_params.split('token=')[-1]
		else:
			await self.close()

		user = await self.get_user_from_token(token_key)

		if user:
			self.user = user
		else:
			await self.close()
			return

		try:
			self.user.online = True
			await self.save_user(self.user)
		except Exception as e:
			logger.exception(f'exception: {e}')

		self.room_group_name = f'user_{self.user.id}'

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		try:
			await self.accept()
			await self.notify_friend_list('online')
			await self.get_pending_self_requests()
		except Exception as e:
			logger.error(f"An error occurred: {e}")

	async def disconnect(self, close_code):
		if hasattr(self, 'user'):
			await self.notify_friend_list('offline')
		try:
			self.user.online = False
			await self.save_user(self.user)
		except Exception as e:
			logger.exception(f'exception: {e}')
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		action = text_data_json['action']

		if action == 'friend_request':
			await self.handle_friend_request(text_data_json)
		elif action == 'respond_request':
			await self.handle_respond_request(text_data_json)
		elif action == 'remove_friend':
			await self.handle_remove_friend(text_data_json)
		elif action == 'block':
			await self.handle_block(text_data_json)
		elif action == 'remove_block':
			await self.handle_remove_block(text_data_json)

	async def handle_friend_request(self, data):
		sender_username = data['sender']
		target_username = data['target']
		try:
			sender = await self.get_user(sender_username)
			target = await self.get_user(target_username)
			try:
				is_blocked = await self.is_user_in_block_list(sender, target)
				if is_blocked:
					raise User.DoesNotExist
				is_blocked = await self.is_user_in_block_list(target, sender)
				if is_blocked:
					raise User.DoesNotExist
				is_friend = await self.is_user_in_friend_list(sender, target)
				if is_friend:
					await self.send(text_data=json.dumps({'detail': 'User is already friend.'}))
					raise ValueError
				try:
					await self.get_friend_request(sender=sender, target=target)
					await self.send(text_data=json.dumps({'detail': 'Friend Request already exists.'}))
				except FriendRequest.DoesNotExist:
					try:
						await self.get_friend_request(sender=sender, target=target)
						await self.send(text_data=json.dumps({'detail': 'Friend Request already exists.'}))
					except FriendRequest.DoesNotExist:
						request = await self.create_friend_request(sender=sender, target=target)
						target_group_name = f'user_{target.id}'
						await self.channel_layer.group_send(
							target_group_name,
							{
								'type': 'friend_request',
								'sender': sender.username,
								'request_id': request.id
							}
						)
			except ValueError:
				pass
		except User.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'User not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': 'Error'}))

	async def friend_request(self, event):
		sender_username = event['sender']
		request_id = event['request_id']

		await self.send(text_data=json.dumps({
			'type': 'friend_request',
			'sender': sender_username,
			'request_id': request_id,
		}))

	async def handle_respond_request(self, data):
		request_id = data['request_id']
		accept = data['accept']
		try:
			request = await self.get_friend_request(id=request_id)
			sender = await self.get_sender(request)
			target = await self.get_target(request)
			if accept:
				await self.add_friend(sender=sender, target=target)
				request.accepted = True
				response = f"Friend request from {sender.id} to {target.id} accepted"
			else:
				request.accepted = False
				response = f"Friend request from {sender.id} to {target.id} denied"
			await self.save_request(request)
			await self.delete_request(request)
			group_name = f'user_{sender.id}'
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'request_reponse',
					'response': response
				}
			)
			await self.send(text_data=json.dumps({'detail': 'Friend request responded to successfully.'}))
		except FriendRequest.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'Friend request not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': f'An error occurred: {str(e)}'}))

	async def request_reponse(self, event):
		response = event['response']

		await self.send(text_data=json.dumps({
			'type': 'request_reponse',
			'response': response,
		}))

	async def handle_remove_friend(self, data):
		target_username = data['target']
		sender_username = data['sender']
		try:
			sender = await self.get_user(sender_username)
			target = await self.get_user(target_username)
			await self.remove_friend(sender=sender, target=target)
			group2_name = f'user_{sender.id}'
			group1_name = f'user_{target.id}'
			await self.channel_layer.group_send(
				group1_name,
				{
					'type': 'friend_removed',
					'sender': sender.username,
					'target': target.username
				}
			)
			await self.channel_layer.group_send(
				group2_name,
				{
					'type': 'friend_removed',
					'sender': sender.username,
					'target': target.username
				}
			)
		except User.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'User not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': 'Error'}))

	async def friend_removed(self, event):
		sender = event['sender']
		target = event['target']

		await self.send(text_data=json.dumps({
			'type': 'friend_removed',
			'sender': sender,
			'target': target
		}))

	async def handle_block(self, data):
		target_username = data['target']
		sender_username = data['sender']
		try:
			sender = await self.get_user(sender_username)
			target = await self.get_user(target_username)
			await self.remove_friend(sender=sender, target=target)
			await self.add_block(sender=sender, target=target)
			group2_name = f'user_{sender.id}'
			group1_name = f'user_{target.id}'
			try:
				request = await self.get_friend_request(sender=sender, target=target)
				await self.delete_request(request)
			except Exception as e:
				try:
					request = await self.get_friend_request(sender=target, target=sender)
					await self.delete_request(request)
				except Exception as e:
					pass
			await self.channel_layer.group_send(
				group1_name,
				{
					'type': 'friend_removed',
					'sender': sender.username,
					'target': target.username
				}
			)
			await self.channel_layer.group_send(
				group2_name,
				{
					'type': 'friend_removed',
					'sender': sender.username,
					'target': target.username
				}
			)
		except User.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'User not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': 'Error'}))

	async def handle_remove_block(self, data):
		target_username = data['target']
		sender_username = data['sender']
		try:
			sender = await self.get_user(sender_username)
			target = await self.get_user(target_username)
			await self.remove_block(sender=sender, target=target)
		except User.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'User not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': 'Error'}))

	async def notify_friend_list(self, status):
		try:
			if self.user:
				friend_list = await self.get_friend_list(self.user.id)
				for friend in friend_list:
					group_name = f"user_{friend.id}"
					await self.channel_layer.group_send(
						group_name,
						{
							'type': 'online_message',
							'user': self.user.username,
							'status': status
						}
					)
		except Exception as e:
			logger.exception(f'exception: {e}')

	async def online_message(self, event):
		status = event['status']
		user = event['user']

		await self.send(text_data=json.dumps({
			'type': 'online_message',
			'user': user,
			'status': status
		}))

	async def get_pending_self_requests(self):
		friend_requests = await self.get_friend_requests(self.user.id)
		if friend_requests:
			for friend_request in friend_requests:
				sender = await self.get_sender(friend_request)
				sender_id = await self.get_related_field_id(sender)
				await self.send(text_data=json.dumps({
					'type': 'friend_request_received',
					'sender_id': sender_id,
					'request_id': friend_request.id,
				}))

	@database_sync_to_async
	def is_user_blocked(self, sender, block_list):
		return sender in block_list

	async def is_user_in_block_list(self, sender, target):
		block_list = await self.get_block_list(target)
		r = await self.is_user_blocked(sender, block_list)
		return r
	
	@database_sync_to_async
	def is_user_friend(self, sender, friend_list):
		return sender in friend_list

	async def is_user_in_friend_list(self, sender, target):
		friend_list = await self.get_friend_list(sender.id)
		r = await self.is_user_friend(target, friend_list)
		return r
	
	@database_sync_to_async
	def get_friend_requests(self, user_id):
		try:
			friend_requests = FriendRequest.objects.filter(target=user_id)
			return list(friend_requests)
		except Exception as e:
			logger.exception(f'exception1: {e}')
			return []

	@database_sync_to_async
	def get_sender(self, friend_request):
		return friend_request.sender
	
	@database_sync_to_async
	def get_target(self, friend_request):
		return friend_request.target

	@database_sync_to_async
	def get_user(self, username):
		return User.objects.get(username=username)

	@database_sync_to_async
	def get_friend_list(self, user_id):
		user = User.objects.get(id=user_id)
		return list(user.friend_list.all())

	@database_sync_to_async
	def get_friend_request(self, **kwargs):
		return FriendRequest.objects.get(**kwargs)
	
	@database_sync_to_async
	def get_block_list(self, target):
		return list(target.block_list.all())
	
	@database_sync_to_async
	def create_friend_request(self, sender, target):
		return FriendRequest.objects.create(sender=sender, target=target)

	@database_sync_to_async
	def add_friend(self, sender, target):
		sender.friend_list.add(target)
		target.friend_list.add(sender)

	@database_sync_to_async
	def add_block(self, sender, target):
		sender.block_list.add(target)

	@database_sync_to_async
	def remove_friend(self, sender, target):
		sender.friend_list.remove(target)
		target.friend_list.remove(sender)

	@database_sync_to_async
	def remove_block(self, sender, target):
		sender.block_list.remove(target)

	@database_sync_to_async
	def save_user(self, user):
		user.save()

	@database_sync_to_async
	def save_request(self, request):
		request.save()

	@database_sync_to_async
	def delete_request(self, request):
		request.delete()

	@database_sync_to_async
	def get_related_field_id(self, related_object):
		return related_object.id
	
	@database_sync_to_async
	def get_user_from_token(self, token_key):
		try:
			token = Token.objects.get(key=token_key)
			user = token.user
			return user
		except Token.DoesNotExist:
			return None
		except Exception as e:
			logger.error(f"An error occurred: {e}")
			return None
