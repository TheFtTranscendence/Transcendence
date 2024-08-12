import json
from channels.generic.websocket import AsyncWebsocketConsumer
from authentication.models import User
from .models import FriendRequest
import logging
from django.core.exceptions import ObjectDoesNotExist
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		self.room_group_name = f'user_{self.user_id}'

		# Join the user-specific group
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		# Leave the user-specific group
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	# Receive message from WebSocket
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		action = text_data_json['action']

		logger.info(f"Received message: {action}")

		# Send message to the target user's group
		if action == 'friend_request':
			sender_id = text_data_json['sender_id']
			target_id = text_data_json['target_id']
			try:
				target = await sync_to_async(User.objects.get)(id=target_id)
				user = await sync_to_async(User.objects.get)(id=sender_id)
				request = await sync_to_async(FriendRequest.objects.create)(sender=user, receiver=target)
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
			except ValueError:
				await self.send(text_data=json.dumps({'detail': 'Invalid user ID format.'}))
			except Exception as e:
				logger.exception(f'exception: {e}')
				await self.send(text_data=json.dumps({'detail': 'Error'}))



		elif action == 'respond_request':
			request_id = text_data_json['request_id']
			accept = text_data_json['accept']
			try:
				request = await sync_to_async(FriendRequest.objects.get)(id=request_id)
				if (accept):
					await sync_to_async(request.sender.friends.add)(request.receiver)
					await sync_to_async(request.receiver.friends.add)(request.sender)
					request.accepted = True
				else:
					request.accepted = False
				await sync_to_async(request.save)()
				response = {'detail': 'Friend request responded to successfully.'}
			except ObjectDoesNotExist:
				response = {'detail': 'Friend request not found.'}
			except Exception as e:
				logger.exception(f'exception: {e}')
				response = {'detail': f'An error occurred: {str(e)}'}
			await self.send(text_data=json.dumps(response))
			


	# Receive message from the group
	async def friend_request_received(self, event):
		sender_id = event['sender_id']

		# Send message to WebSocket
		await self.send(text_data=json.dumps({
			'type': 'friend_request_received',
			'sender_id': sender_id,
		}))