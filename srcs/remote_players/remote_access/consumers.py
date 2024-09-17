from channels.db import database_sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from .models import Game

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

		#todo: add user count to game
		logger.info(f"Game {self.game_id}: [<user_count>/2]")
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'game_info',
				'reason': 'Ready',
			}
		)

	async def handle_connection_lost(self):
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				'type': 'game_info',
				'info': 'Disconect',
			}
		)
		try:
			game = await self.get_game(self.game_id)
			logger.info(f"GameConsumer: Game between user {game.player_1} and {game.player_2} ended because one of the users lost connection")
			await self.delete_game(game)
		except Game.DoesNotExist:
			pass
		except Exception as e:
			logger.exception(f"Exception in GameConsumer \n\tFunction: \"connect\":\n {e}")

	#todo: handle this with close_codes
	async def disconnect(self, close_code):
		await self.handle_connection_lost()
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)

		# * Debug
		logger.debug(f"json: {text_data_json}")

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

	async def game_info(self, event):
		info = event['info']

		await self.send(text_data=json.dumps({
			'type': 'game_info',
			'info': info,
		}))

	async def move(self, event):
		player_id = event['player_id']
		action = event['action']

		await self.send(text_data=json.dumps({
			'type': 'move',
			'player_id': player_id,
			'action': action
		}))

	@database_sync_to_async
	def get_game(self, game_id):
		return Game.objects.get(id=game_id)
	
	@database_sync_to_async
	def delete_game(self, game):
		game.delete()

class QueueConsumer(AsyncWebsocketConsumer):
	queue_Pong = []
	queue_Fighty = []
	game_size = 2

	async def connect(self):
		self.game = self.scope['url_route']['kwargs']['game']
		self.user_id = self.scope['url_route']['kwargs']['user_id']

		await self.accept()

		if self.is_user_in_any_queue(self.user_id):
			logger.info(f"QueueConsumer: User {self.user_id} tried to join a queue but he is already in one")
			await self.send(json.dumps({
				'status': 'error',
				'message': 'User is already in a queue!'
			}))
			await self.close()
			return

		if self.game == 'Pong':
			self.queue_Pong.append(self)

			if (len(self.queue_Pong) >= 2):
				await self.start_game()
		elif self.game == 'Fighty':
			self.queue_Fighty.append(self)

			if (len(self.queue_Fighty) >= 2):
				await self.start_game()
		logger.info(f"QueueConsumer: User {self.user_id} joined {self.game}'s queue")


	async def disconnect(self, close_code):
		if self in self.queue_Pong:
			self.queue_Pong.remove(self)
		if self in self.queue_Fighty:
			self.queue_Fighty.remove(self)


	async def start_game(self):
		logger.info('Entered start_game')
		if self.game == 'Pong':
			players = self.queue_Pong[:self.game_size]
			self.queue_Pong = self.queue_Pong[self.game_size:]
		elif self.game == 'Fighty':
			players = self.queue_Fighty[:self.game_size]
			self.queue_Fighty = self.queue_Fighty[self.game_size:]

		logger.exception('reached here')
		data = {
			"player_1": players[0].user_id,
			"player_2": players[1].user_id,
		}
		logger.exception('created data')
		game = await self.create_game(data)
		logger.exception('created game')

		for player in players:
			await player.send(json.dumps({
				'status': 'match_found',
				'game': self.game,
				'game_id': game.id,
				'player1': players[0].user_id,
				'player2': players[1].user_id,
			}))

		for player in players:
			await player.close()

	def is_user_in_any_queue(self, user_id):
		for player in self.queue_Pong:
			if player.user_id == user_id:
				return True
		
		for player in self.queue_Fighty:
			if player.user_id == user_id:
				return True

		return False

	@database_sync_to_async
	def create_game(self, data):
		try:
			game = Game.objects.create(
				player_1 = data['player_1'],
				player_2 = data['player_2'],
			)
		except Exception as e:
			logger.exception(f'exception: {e}')
		return game
