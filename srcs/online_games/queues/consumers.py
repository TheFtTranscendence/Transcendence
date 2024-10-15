# consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import GameQueue
from remote_games.models import Game
from asgiref.sync import sync_to_async
import logging

logger = logging.getLogger(__name__)

class GameQueueConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.game_name = self.scope['url_route']['kwargs']['game_name']
		self.game_size = self.scope['url_route']['kwargs']['game_size']
		self.queue_group_name = f'queue_{self.game_name}_{self.game_size}'

		await self.channel_layer.group_add(
			self.queue_group_name,
			self.channel_name
		)

		await self.accept()

	async def disconnect(self, close_code):
		try:
			if close_code is not 3000:
				if (self.user):
					await sync_to_async(self.game_queue.remove_player)(self.user)

				message = f"user_{self.user} has left {self.queue_group_name}"
				await self.send_to_group(message)

			await self.channel_layer.group_discard(
				self.queue_group_name,
				self.channel_name
			)

			await self.close(code = close_code)
		except Exception as e:
			logger.exception(e)
			await self.send(text_data=json.dumps({'error': str(e)}))
		
	async def receive(self, text_data):
		data = json.loads(text_data)
		action = data.get('action')

		try:
			if action == 'join':
				user = data.get('user')
				await self.handle_join(user)
			elif action == 'leave':
				await self.disconnect(1000)
			else:
				await self.send(text_data=json.dumps({'error': 'Unknown action.'}))
		except Exception as e:
			logger.exception(e)
			await self.send(text_data=json.dumps({'error': str(e)}))

	async def handle_join(self, user):
		self.user = user
		self.game_queue, created = await sync_to_async(GameQueue.objects.get_or_create)(game_name=self.game_name, game_size=self.game_size)

		await sync_to_async(self.game_queue.add_player)(self.user)

		message = f"user_{self.user} has joined {self.queue_group_name}"
		await self.send_to_group(message)

		if self.game_queue.is_full():

			game = await sync_to_async(Game.objects.create)(game_name=self.game_queue.game_name, game_size=self.game_queue.game_size)
			await self.channel_layer.group_send(
				self.queue_group_name, {
					'type': 'game_ready_message',
					'game_name': game.game_name,
					'game_id': game.id,
				})
			
	async def game_ready_message(self, event):
		game_name = event['game_name']
		game_id = event['game_id']

		await self.send(text_data=json.dumps({
			'message': 'Game is ready',
			'game_name': game_name,
			'game_id': game_id,
		}))

		await sync_to_async(self.game_queue.remove_all_player)()
		await self.disconnect(3000)

	async def send_to_group(self, message):
		await self.channel_layer.group_send(
			self.queue_group_name,
			{
				'type': 'queue_message',
				'message': message
			}
		)

	async def queue_message(self, event):
		message = event['message']

		await self.send(text_data=json.dumps({
			'message': message
		}))
