import json
from channels.generic.websocket import WebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        try:
            logger.info(f'WebSocket connected: {self.channel_name}')
            self.chat_id = 16
            self.room_group_name = f'chat_{self.chat_id}'

            self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            self.accept()
            
            self.send(text_data=json.dumps({
                'type': 'connection_established',
                'message': 'You are now connected!'
            }))
        except Exception as e:
            logger.error(f"Error during connect: {e}")

    def disconnect(self, close_code):
        try:
            logger.info(f'WebSocket disconnected: {self.channel_name}')
            self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
        except Exception as e:
            logger.error(f"Error during disconnect: {e}")

    def receive(self, text_data):
        try:
            logger.info(f'Message received: {text_data}')
            text_data_json = json.loads(text_data)
            message = text_data_json.get('content')
            sender_id = text_data_json.get('sender_id')

            if not message or not sender_id:
                raise ValueError("Invalid message data received")

            chat_id = self.chat_id

            # Save message (make sure this method is implemented correctly)
            self.save_message(sender_id, chat_id, message)

            self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'sender_id': sender_id
                }
            )
        except Exception as e:
            logger.error(f"Error during receive: {e}")

    def chat_message(self, event):
        try:
            message = event['message']
            sender_id = event['sender_id']

            self.send(text_data=json.dumps({
                'content': message,
                'sender_id': sender_id
            }))
        except Exception as e:
            logger.error(f"Error during chat_message: {e}")
