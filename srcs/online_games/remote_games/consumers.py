import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Game, GamePlayer
import logging
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.game_id = self.scope['url_route']['kwargs']['id']
		self.game_group_name = f'game_{self.game_id}'

		try:
			self.game = await sync_to_async(Game.objects.get)(id=self.game_id)
			await self.channel_layer.group_add(
				self.game_group_name,
				self.channel_name
			)

			await self.accept()
		except Game.DoesNotExist:
			await self.send(text_data=json.dumps({
				'error': 'Game not found.'
			}))

		except Exception as e:
			logger.info(f"error: {e}")
			await self.send(text_data=json.dumps({'error': str(e)}))

	async def disconnect(self, close_code):
		await self.handle_leave(close_code)

		await self.channel_layer.group_discard(
			self.game_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		data = json.loads(text_data)
		action = data.get('action')

		if action == 'ready':
			user = data.get('user')
			skin_id = data.get('skin_id')
			await self.handle_ready(user, skin_id)
		elif action == 'leave':
			close_code = data.get('close_code')
			await self.handle_leave(close_code)
		elif action == 'move' and self.game.status == 'ongoing':
			await self.handle_move(data)
		else:
			await self.send(text_data=json.dumps({'error': 'Unknown action.'}))

	async def handle_move(self, data):
		await self.channel_layer.group_send(
			self.game_group_name,
			{
				'type': 'move_message',
				'action': data
			}
		)

	async def move_message(self, event):
		action = event['action']

		await self.send(text_data=json.dumps({
			'sender_id': self.user,
			'action': action
		}))

	async def handle_ready(self, user, skin_id):
		try:
			self.user = user
			await sync_to_async(self.game.add_player)(self.user, skin_id)

			await self.send_to_group(f'user_{self.user} is ready')
		
			all_ready = await sync_to_async(self.game.is_full)()

			if all_ready:
				await self.send_to_group('Game is starting')
				await sync_to_async(self.game.change_status)('ongoing')
				return
			
		except Exception as e:
			logger.info(f"error: {e}")
			await self.send(text_data=json.dumps({'error': str(e)}))


	async def handle_leave(self, close_code):
		try:
			game_player = await GamePlayer.objects.get(user=self.user, game=self.game)
			game_player.delete()

			self.close(close_code)

			#todo: maybe the upload to the blockchain should be done here and not in the frontend

		except GamePlayer.DoesNotExist:
			await self.send(text_data=json.dumps({
				'error': 'User not in the game.'
			}))


	async def send_to_group(self, message):
		await self.channel_layer.group_send(
			self.game_group_name,
			{
				'type': 'game_message',
				'message': message
			}
		)

	async def game_message(self, event):
		message = event['message']

		await self.send(text_data=json.dumps({
			'message': message
		}))
