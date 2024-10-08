from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

import json
from authentication.models import User
from .models import FriendRequest
from rest_framework.authtoken.models import Token
import requests

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
			await self._getPendingFriendRequests()
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
			await self.handleFriendRequest(text_data_json)
		elif msg_type == 'resquest_response':
			await self.handleRequestResponse(text_data_json)
		elif msg_type == 'remove_friend':
			await self.handleRemoveFriend(text_data_json)
		elif msg_type == 'block':
			await self.handleBlock(text_data_json)
		elif msg_type == 'remove_block':
			await self.handleRemoveBlock(text_data_json)
		elif msg_type == 'game_invite':
			await self.handleGameInvite(text_data_json)

	#
	async def handleFriendRequest(self, data):
		'''
		To use this function send:
		{
			"type": "friend_request",
			"target": [target.id]
		}
		'''
		target_id = data['target']

		try:
			target = await self._getUser(id=target_id)

			is_blocked = await self._isUserBlocked(target)
			if is_blocked:
				raise User.DoesNotExist
			is_friend = await self._isUserFriend(target)
			if is_friend:
				raise User.AlreadyFriends
			
			try:
				# [1/2] Check if it exists any friend request pending from sender to target
				await self._getFriendRequests(sender=self.user, target=target)
				raise	FriendRequest.AlreadyExists
			except FriendRequest.DoesNotExist:
				try:
					# [2/2] Check if it exists any friend request pending from target to sender
					await self._getFriendRequests(sender=target, target=self.user)
					raise	FriendRequest.AlreadyExists
				except FriendRequest.DoesNotExist:

					# If neither of them existed it created one and sends it to the target
					request = await self._createFriendRequest(target)
					target_group_name = f's_{target.id}'
					await self.channel_layer.group_send(
						target_group_name,
						{
							'type': 'friend_request',
							'sender': self.user.id,
						}
					)
		except	FriendRequest.AlreadyExists:
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'Friend Request already exists',
				}))
			return
		except User.DoesNotExist:
			logger.info(f"[Social]: Friend request from {self.user.username} failed")
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User not found'
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
		
	async def friend_request(self, event):
		sender_id = event['sender']

		await self.send(text_data=json.dumps({
			'type': 'friend_request',
			'sender': sender_id,
		}))

	async def handleRequestResponse(self, data):
		'''
		To use this function send:
		{
			"type": "request_response",
			"target": [target.id],
			"response": true/false
		}
		'''
		target_id = data['target']
		response = data['response']
		try:			
			target = await self._getUser(id=target_id)

			request = await self._getFriendRequests(sender=target, target=self.user)

			if response:

				await self._addFriend(target=target)
				await self.send(text_data=json.dumps({
					'type': 'feedback',
					'detail': 'Friend request accepted'
				}))

			else:
				await self.send(text_data=json.dumps({
					'type': 'feedback',
					'detail': 'Friend request dennied'
				}))

			await self._deleteObject(request)

			group_name = f's_{target.id}'
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'request_reponse',
					'sender': self.user.id,
					'response': response,
				}
			)

		except FriendRequest.DoesNotExist:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'Friend Request does not exists',
				}))
			return
		except User.DoesNotExist:
			logger.info(f"[Social]: Friend request from {self.user.username} failed")
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User not found'
				}))
			return
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return
		
	async def request_reponse(self, event):
		sender_id = event['sender']
		response = event['response']

		await self.send(text_data=json.dumps({
			'type': 'request_reponse',
			'sender': sender_id,
			'response': response
		}))
		
	async def handleRemoveFriend(self, data):
		'''
		To use this function send:
		{
			"type": "remove_friend",
			"target": [target.id]
		}
		'''
		target_id = data['target']

		try:
			target = await self._getUser(id=target_id)

			await self._removeFriend(target=target)

			await self.send(text_data=json.dumps({
					'type': 'friend_removed',
					'user': target.id
				}))
			group_name = f'user_{self.user.id}'
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'friend_removed',
					'user': self.user.id
				}
			)
			return 1

		except User.DoesNotExist:
			logger.info(f"[Social]: Friend remove from {self.user.username} failed")
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User not found'
				}))
			return 0
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return 0
		
	async def friend_removed(self, event):
		target_id = event['user']

		await self.send(text_data=json.dumps({
			'type': 'friend_removed',
			'user': target_id,
		}))

	class	GameDoesntExist(Exception):
		pass

	async def handleGameInvite(self, data):
		'''
		To use this function send:
		{
			"type": "game_invite",
			"target": [target.id],
			"game": [pongy/fighty]
		}
		'''
		target_id = data['target']
		game = data['game']

		try:
			if game != 'pongy' and game != 'fighty':
				raise self.GameDoesntExist

			target = await self._getUser(id=target_id)

			json_payload = {
				"player_1": self.user.id,
				"player_2": target.id
			}

			response = requests.post("http://remote-players:8004/game/", json_payload)
			response.raise_for_status()
			data = response.json()

			game_id = data['id']

			await self.send(json.dumps({
				'type': 'game_invite',
				'game': game,
				'game_id': game_id,
				'player1': self.user.id,
				'player2': target.id,
			}))
			group_name = f"s_{target.id}"
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'game_invite',
					'game': game,
					'game_id': game_id,
					'player1': self.user.id,
					'player2': target.id,
				}
			)
		
		except User.DoesNotExist:
			logger.info(f"[Social]: Game invite from {self.user.username} failed")
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User not found'
				}))
			return
		except self.GameDoesntExist:
			logger.info(f"[Social]: Game invite from {self.user.username} failed")
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'Game not found'
				}))
			return
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return
		
	async def game_invite(self, event):
		game = event['game']
		game_id = event['game_id']
		player1 = event['player1']
		player2 = event['player2']

		await self.send(text_data=json.dumps({
			'type': 'game_invite',
			'game': game,
			'game_id': game_id,
			'player1': player1,
			'player2': player2,
		}))
		

	# ! They can only block each other if they are friends
	async def handleBlock(self, data):
		target_id = data['target']
		try:
			target = await self._getUser(id=target_id)

			is_blocked = await self._isUserBlocked(target)
			if is_blocked:
				raise User.AlreadyBlocked
			is_friend = await self._isUserFriend(target)
			if not is_friend:
				raise User.DoesNotExist

			response = await self.handleRemoveFriend(data)
			if not response:
				return
			
			await self._addBlock(target=target)

		except User.DoesNotExist:
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User not found'
				}))
			return
		except User.AlreadyBlocked:
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User already blocked'
				}))
			return
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return
		
	async def handleRemoveBlock(self, data):
		target_id = data['target']
		try:

			target = await self._getUser(id=target_id)
			is_blocked = await self._isUserBlocked(target)
			if not is_blocked:
				raise User.DoesNotExist
			await self._removeBlock(target)

		except User.DoesNotExist:
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'User not found'
				}))
			return
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return

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
	
	async def _notifyOnlineStatus(self):
		friend_list = await self._getFriendList()
		for friend in friend_list:
			group_name = f"s_{friend.id}"
			await self.channel_layer.group_send(
				group_name,
				{
					'type': 'status',
					'user': self.user.id,
					'status': self.user.online
				}
			)

	async def status(self, event):
		user_id = event['user']
		status = event['status']

		await self.send(text_data=json.dumps({
			'type': 'online_message',
			'user': user_id,
			'status': status
		}))

	@database_sync_to_async
	def _getSenderIdFromFriendRequest(self, friend_request):
		return (friend_request.sender.id)

	async def _getPendingFriendRequests(self):
		friend_requests = await self._getFriendRequests()
		if friend_requests:
			for friend_request in friend_requests:
				sender_id = await self._getSenderIdFromFriendRequest(friend_request)
				await self.send(text_data=json.dumps({
					'type': 'friend_request',
					'sender': sender_id,
				}))
	
	@database_sync_to_async
	def _removeFriend(self, target):
		self.user.friend_list.remove(target)
		target.friend_list.remove(self.user)

	@database_sync_to_async
	def _removeBlock(self, target):
		self.user.block_list.remove(target)

	@database_sync_to_async
	def _createFriendRequest(self, target):
		return FriendRequest.objects.create(sender=self.user, target=target)
	
	@database_sync_to_async
	def _addFriend(self, target):
		self.user.friend_list.add(target)
		target.friend_list.add(self.user)

	@database_sync_to_async
	def _addBlock(self, target):
		self.user.block_list.add(target)

	@database_sync_to_async
	def _deleteObject(self, object):
		object.delete()

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

	@database_sync_to_async
	def _getRequests(self, sender=None, target = None):
		try:
			if sender is None and target is None:
				friend_requests = FriendRequest.objects.filter(target=self.user)
				return list(friend_requests)
			else:
				friend_requests = FriendRequest.objects.filter(sender=sender, target=target)
				return list(friend_requests)
		except Exception as e:
			logger.exception(f'exception1: {e}')
			return []

	@database_sync_to_async
	def _getFriendRequests(self, sender=None, target = None):
		if sender is None and target is None:
			try:
				friend_requests = FriendRequest.objects.filter(target=self.user)
				logger.debug(list(friend_requests))
				return list(friend_requests)
			except Exception as e:
				logger.exception(f'exception1: {e}')
				return []
		else:
			return FriendRequest.objects.get(sender=sender, target=target)
