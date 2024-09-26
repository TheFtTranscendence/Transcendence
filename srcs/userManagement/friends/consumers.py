from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

import json
from authentication.models import User
from .models import FriendRequest
from rest_framework.authtoken.models import Token

import logging
logger = logging.getLogger(__name__)

class	SocialConsumer(AsyncWebsocketConsumer):


	async def	connect(self):
		try:
			try:
				self.user = await self._getUserOnConnect()
			except Exception as e:
				self.close()
				return;
		
			self.room_name = f"s_{self.user.id}";
			self._setOnline();
			await self.channel_layer.group_add(
				self.room_name,
				self.channel_name
			)

			await self.accept()
			await self._notifyOnlineStatus()
			await self._getPendingSelfRequests()
		except Exception as e:
			logger.exception(f'exception: {e}')

	async def disconnect(self, close_code):
		try:
			if self.user:
				self._setOffline()
				await self._notifyOnlineStatus()
				await self.channel_layer.group_discard(
					self.room_name,
					self.channel_name
				)
		except Exception as e:
			logger.exception(f'exception: {e}')

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		msg_type = text_data_json['type']

		if msg_type == 'friend_request':
			await self.handle_friend_request(text_data_json)
		elif msg_type == 'resquest_response':
			await self.handle_respond_request(text_data_json)
		elif msg_type == 'remove_friend':
			await self.handle_remove_friend(text_data_json)
		elif msg_type == 'block':
			await self.handle_block(text_data_json)
		elif msg_type == 'remove_block':
			await self.handle_remove_block(text_data_json)

	async def	_isUserBlocked(self, target):
		my_block_list = await self._getBlockList()
		target_block_list = await self._getBlockList(target)		
		if self.user in target_block_list or target in my_block_list:
			return True;
		return False
	
	async def	_isUserFriend(self, target):
		friend_list = await self._getFriendList()
		if target in friend_list:
			return True;
		return False
	
	@database_sync_to_async
	def _createFriendRequest(self, target):
		return FriendRequest.objects.create(sender=self.user, target=target)
	
	async def handle_friend_request(self, data):
		sender_id = data['sender']
		target_id = data['target']

		try:

			if self.user.id != sender_id:
				raise User.DoesNotExist

			target = await self._getUser(id=target_id)

			is_blocked = await self._isUserBlocked(target)
			if is_blocked:
				raise User.DoesNotExist
			is_friend = await self._isUserFriend(target)
			if is_friend:
				raise User.AlreadyFriends
			
			try:
				# [1/2] Check if it exists any friend request pending from sender to target
				# ! Wrong function, it need to look it all objects from friend request not the friend request of the user
				# ! PC batery about to die
				await self._getFriendRequests(sender=self.user, target=target)
				raise	FriendRequest.AlreadyExists
			except FriendRequest.DoesNotExist:
				try:
					# [2/2] Check if it exists any friend request pending from target to sender
					await self._getFriendRequests(sender=self.user, target=target)
					raise	FriendRequest.AlreadyExists
				except FriendRequest.DoesNotExist:

					# If neither of them existed it created one and sends it to the target
					request = await self._createFriendRequest(target)
					target_group_name = f's_{target.id}'
					await self.channel_layer.group_send(
						target_group_name,
						{
							'type': 'friend_request',
							'sender': self.user.username,
							'request_id': request.id
						}
					)
		except	FriendRequest.AlreadyExists:
			await self.send(text_data=json.dumps({
				'type': 'error',
				'detail': 'Friend Request already exists',
				}))
		except User.DoesNotExist:
			logger.info(f"[Social]: Friend request from {self.user.username} failed")
			await self.send(text_data=json.dumps({
				'type': 'error',
				'detail': 'User not found.'
				}))
			return
		except User.AlreadyFriends:
			logger.info(f"[Social]: Friend request from {self.user.username} failed")
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detaild': 'already friends'
				}))
			return
		except Exception as e:
			logger.exception(f'[Social]: {e}')
			await self.send(text_data=json.dumps({
				'type': 'error',
				'detail': 'IDFK'
				}))
			return
		logger.info(f"[Social]: Friend request from {self.user.username} sucedded")

	@database_sync_to_async
	def	_saveUser(self):
		self.user.save()

	@database_sync_to_async
	def	_setOnline(self):
		self.user.online = True
		self.user.save()

	@database_sync_to_async
	def	_setOffline(self):
		self.user.online = False
		self.user.save()

	@database_sync_to_async
	def	_getUser(self, username=None, id=None):
		if username is not None:
			return User.objects.get(username=username)
		elif id is not None:
			return User.objects.get(id=id)
	
	async def	_getUserOnConnect(self):

		query_params = self.scope['query_string'].decode()
		if 'user=' in query_params:
			username = query_params.split('user=')[-1]
		else:
			logger.error(f"[Social] - connect: User tried to connect to social socket, but didn't give a username")
			raise Exception("username not provided")

		user = await	self._getUser(username=username)
		if not user:
			logger.error(f"[Social] - connect: User tried to connect to social socket, but didn't give a valid username")
			raise Exception("user doesn't exist")
		
		return user

	@database_sync_to_async
	def	_getBlockList(self, target = None):
		if target is None:
			return list(self.user.block_list.all())
		else:
			return list(target.block_list.all())

	@database_sync_to_async
	def	_getFriendList(self, target = None):
		if target is None:
			return list(self.user.friend_list.all())
		else:
			return list(target.friend_list.all())

	async def _notifyOnlineStatus(self):
		friend_list = await self._getFriendList()
		for friend in friend_list:
			group_name = f"s_{friend.id}"
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'status',
					'user': self.user.username,
					'status': self.user.online
				}
			)
	
	async def status(self, event):
		status = event['online']
		user = event['user']

		await self.send(text_data=json.dumps({
			'type': 'status',
			'user': user,
			'online': status
		}))

	@database_sync_to_async
	def _getFriendRequests(self):
		try:
			friend_requests = FriendRequest.objects.filter(target=self.user.id)
			return list(friend_requests)
		except Exception as e:
			logger.exception(f'exception1: {e}')
			return []

	async def _getPendingSelfRequests(self):
		friend_requests = await self._getFriendRequests()
		if friend_requests:
			for friend_request in friend_requests:
				await self.send(text_data=json.dumps({
					'type': 'friend_request',
					'sender': friend_request.sender.id,
					'target': friend_request.target.id
				}))

	async def friend_request(self, event):
		sender = event['sender']
		target = event['target']

		await self.send(text_data=json.dumps({
			'type': 'friend_request',
			'sender': sender,
			'target': target
		}))