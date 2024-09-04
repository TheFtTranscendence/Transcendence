from channels.db import database_sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from authentication.models import User
from .models import FriendRequest
import logging
from rest_framework.authtoken.models import Token


logger = logging.getLogger(__name__)

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
			await self.notify_friends('online')
			await self.get_pending_self_requests()
		except Exception as e:
			logger.error(f"An error occurred: {e}")

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

	async def disconnect(self, close_code):
		if hasattr(self, 'user'):
			await self.notify_friends('offline')
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

	async def handle_friend_request(self, data):
		sender_id = data['sender_id']
		target_id = data['target_id']
		try:
			target = await self.get_user(target_id)
			user = await self.get_user(sender_id)
			try:
				await self.get_friend_request(sender=user, receiver=target)
				await self.send(text_data=json.dumps({'detail': 'Friend Request already exists.'}))
			except FriendRequest.DoesNotExist:
				request = await self.create_friend_request(sender=user, receiver=target)
				target_group_name = f'user_{target_id}'
				await self.channel_layer.group_send(
					target_group_name,
					{
						'type': 'friend_request_received',
						'sender_id': sender_id,
						'request_id': request.id
					}
				)
		except User.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'User not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': 'Error'}))

	async def handle_respond_request(self, data):
		request_id = data['request_id']
		accept = data['accept']
		try:
			request = await self.get_friend_request(id=request_id)
			sender = await self.get_sender(request)
			receiver = await self.get_receiver(request)
			if accept:
				await self.add_friend(sender=sender, receiver=receiver)
				request.accepted = True
				message = f"Friend request from {sender.id} to {receiver.id} accepted"
			else:
				request.accepted = False
				message = f"Friend request from {sender.id} to {receiver.id} denied"
			await self.save_request(request)
			await self.delete_request(request)
			group_name = f'user_{sender.id}'
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'message',
					'message': message
				}
			)
			await self.send(text_data=json.dumps({'detail': 'Friend request responded to successfully.'}))
		except FriendRequest.DoesNotExist:
			await self.send(text_data=json.dumps({'detail': 'Friend request not found.'}))
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({'detail': f'An error occurred: {str(e)}'}))

	async def friend_request_received(self, event):
		sender_id = event['sender_id']
		request_id = event['request_id']
		await self.send(text_data=json.dumps({
			'type': 'friend_request_received',
			'sender_id': sender_id,
			'request_id': request_id,
		}))

	async def message(self, event):
		message = event['message']
		await self.send(text_data=json.dumps({
			'type': 'message',
			'message': message,
		}))

	async def notify_friends(self, status):
		try:
			if self.user:
				friends = await self.get_friends(self.user.id)
				for friend in friends:
					group_name = f"user_{friend.id}"
					await self.channel_layer.group_send(
						group_name,
						{
							'type': 'message',
							'message': f"{self.user.username} is {status}"
						}
					)
		except Exception as e:
			logger.exception(f'exception: {e}')

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
	def get_friend_requests(self, user_id):
		try:
			friend_requests = FriendRequest.objects.filter(receiver=user_id)
			return list(friend_requests)
		except Exception as e:
			logger.exception(f'exception1: {e}')
			return []

	@database_sync_to_async
	def get_sender(self, friend_request):
		return friend_request.sender
	
	@database_sync_to_async
	def get_receiver(self, friend_request):
		return friend_request.receiver

	@database_sync_to_async
	def get_user(self, user_id):
		return User.objects.get(id=user_id)

	@database_sync_to_async
	def get_friends(self, user_id):
		user = User.objects.get(id=user_id)
		return list(user.friends.all())

	@database_sync_to_async
	def get_friend_request(self, **kwargs):
		return FriendRequest.objects.get(**kwargs)

	@database_sync_to_async
	def create_friend_request(self, sender, receiver):
		return FriendRequest.objects.create(sender=sender, receiver=receiver)

	@database_sync_to_async
	def add_friend(self, sender, receiver):
		sender.friends.add(receiver)
		receiver.friends.add(sender)

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
