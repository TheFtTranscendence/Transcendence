import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.chat_id = self.scope['url_route']['kwargs']['chat_id']
		self.roomGroupName = f"group_{self.chat_id}"
		await self.channel_layer.group_add(
			self.roomGroupName,
			self.channel_name
		)
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.roomGroupName, 
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		chat_id = text_data_json["chat_id"]
		sender_id = text_data_json["sender_id"]
		content = text_data_json["content"]
		
		await self.channel_layer.group_send(
			self.roomGroupName, {
				"type": "sendMessage",
				"chat_id": chat_id,
				"sender_id": sender_id,
				"content": content,
			})
		
	async def sendMessage(self, event): 
		chat_id = event["chat_id"]
		sender_id = event["sender_id"]
		content = event["content"]

		data = {
			"chat_id": chat_id,
			"sender_id": sender_id,
			"content": content,
		}
		
		await self.add_message_to_chat(data)
		await self.increment_unread_messages(chat_id, sender_id)
		await self.send(text_data=json.dumps({
			"chat_id": chat_id,
			"sender_id": sender_id,
			"content": content,
		}))
		
	@database_sync_to_async
	def increment_unread_messages(self, chat_id, sender_id):
		chat = Chat.objects.get(id=chat_id)
		if chat.user1_id == sender_id:
			chat.user2_unread_messages += 1
		elif chat.user2_id == sender_id:
			chat.user1_unread_messages += 1
		chat.save()

	@database_sync_to_async
	def add_message_to_chat(self, data):
		chat = Chat.objects.get(id=data['chat_id'])
		message = Message.objects.create(
			chat=chat,
			sender_id=data['sender_id'],
			content=data['content'],
		)
		message.save()
