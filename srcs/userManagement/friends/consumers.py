import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope['url_route']['kwargs']['room_name']
		self.room_group_name = f'user_{self.room_name}'

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
		message = text_data_json['message']
		target = text_data_json['target']

		print(f"Received message: {message} for target: {target}")

		# Send message to the target user's group
		target_group_name = f'user_{target}'
		await self.channel_layer.group_send(
			target_group_name,
			{
				'type': 'chat_message',
				'message': message
			}
		)

	# Receive message from the group
	async def chat_message(self, event):
		message = event['message']

		# Send message to WebSocket
		await self.send(text_data=json.dumps({
			'message': message,
		}))