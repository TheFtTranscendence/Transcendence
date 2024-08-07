import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user_id = self.scope["user"].id

        chat = await self.get_chat(self.chat_id)

        await self.create_message(chat, user_id, message)

        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': user_id,
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
        }))

    @database_sync_to_async
    def get_chat(self, chat_id):
        return Chat.objects.get(id=chat_id)

    @database_sync_to_async
    def create_message(self, chat, user_id, message):
        return Message.objects.create(chat=chat, sender_id=user_id, content=message)
