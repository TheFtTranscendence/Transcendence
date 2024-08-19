from channels.db import database_sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.game_id = self.scope['url_route']['kwargs']['game_id']
		self.room_group_name = f'game_{self.game_id}'

		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		player_id = text_data_json['player_id']
		action = text_data_json['action']

		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'move',
				'player_id': player_id,
				'action': action
			}
		)


	async def move(self, event):
		player_id = event['player_id']
		action = event['action']

		await self.send(text_data=json.dumps({
			'type': 'move',
			'player_id': player_id,
			'action': action
		}))
