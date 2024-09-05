import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.chat_id = self.scope['url_route']['kwargs']['chat_id']
		query_param = self.scope['query_string'].decode()
		if ('user=') in query_param:
			self.user = query_param.split('user=')[-1]
		if ('user=') in query_param:
			self.user = query_param.split('user=')[-1]
		else:
			await self.close()
		#todo: check if the chat that they are connecting to exists
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
		sender = text_data_json["sender"]
		content = text_data_json["content"]
		
		await self.channel_layer.group_send(
			self.roomGroupName, {
				"type": "sendMessage",
				"chat_id": chat_id,
				"sender": sender,
				"content": content,
			})
		
	async def sendMessage(self, event): 
		chat_id = event["chat_id"]
		sender = event["sender"]
		content = event["content"]

		#todo: remove chat_id, the socket already knows it
		data = {
			"chat_id": chat_id,
			"sender": sender,
			"content": content,
		}
		
		if (sender != self.user):
			await self.add_message_to_chat(data)
		
			await self.increment_unread_messages(chat_id, sender)
		
			await self.send(text_data=json.dumps({
				"chat_id": chat_id,
				"sender": sender,
				"content": content,
			}))
		
	@database_sync_to_async
	def increment_unread_messages(self, chat_id, sender):
		chat = Chat.objects.get(id=chat_id)
		if chat.user1 == sender:
			chat.user2_unread_messages += 1
		elif chat.user2 == sender:
			chat.user1_unread_messages += 1
		chat.save()

	@database_sync_to_async
	def add_message_to_chat(self, data):
		chat = Chat.objects.get(id=data['chat_id'])
		message = Message.objects.create(
			chat=chat,
			sender=data['sender'],
			content=data['content'],
		)
		message.save()
