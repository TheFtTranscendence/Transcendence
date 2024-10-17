import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from channels.db import database_sync_to_async
import logging

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):

	async def connect(self):
		query_param = self.scope['query_string'].decode()
		params = dict(param.split('=') for param in query_param.split('&'))

		if 'user' in params:
			self.user = params['user']
		else:
			await self.close()

		self.active_chats = set()

		await self.accept()

	async def disconnect(self, close_code):
		pass

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)

		if 'join_chat_id' in text_data_json:
			await self.join_chat(text_data_json['join_chat_id'])
		else:
			chat_id = text_data_json["chat_id"]
			sender = text_data_json["sender"]
			content = text_data_json["content"]
			roomName = f"group_{chat_id}"
			await self.channel_layer.group_send(
				roomName,
				{
					"type": "sendMessage",
					"chat_id": chat_id,
					"sender": sender,
					"content": content,
				}
			)


	async def join_chat(self, new_chat_id):

		if new_chat_id not in self.active_chats:

			self.active_chats.add(new_chat_id)
			roomGroupName = f"group_{new_chat_id}"

			await self.channel_layer.group_add(
				roomGroupName,
				self.channel_name
				)

	async def sendMessage(self, event):
		chat_id = event["chat_id"]
		sender = event["sender"]
		content = event["content"]

		data = {
			"chat_id": chat_id,
			"sender": sender,
			"content": content,
		}

		if sender == self.user:
			await self.add_message_to_chat(data)
		else:
			await self.send(text_data=json.dumps({
				"chat_id": event["chat_id"],
				"sender": sender,
				"content": content,
			}))


	@database_sync_to_async
	def add_message_to_chat(self, data):
		try:
			chat = Chat.objects.get(id=data['chat_id'])
			message = Message.objects.create(
				chat=chat,
				sender=data['sender'],
				content=data['content'],
			)
			message.save()
		except Chat.DoesNotExist:
			logger.error(f"Chat with id {data['chat_id']} does not exist.")
		except Exception as e:
			logger.error(f"An error occurred: {e}")

