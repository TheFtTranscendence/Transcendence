from channels.db import database_sync_to_async
import json
from channels.generic.websocket import AsyncWebsocketConsumer
import logging
from .models import Game

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):

	ERROR_LOGGING_IN = 3042;
	REQUEST_DENIED = 3024
	#USER_DISCONECT = default

	class	ErrorLoggingIn(Exception):
		pass

	class	GameFull(Exception):
		pass

	async def connect(self):

		try:
			query_params = self.scope['query_string'].decode()
			if 'game_id=' in query_params:
				game_id = query_params.split('game_id=')[-1]
			else:
				raise self.ErrorLoggingIn
			

			self.game = await self._getGame(game_id)
			if not self.game:
				raise self.ErrorLoggingIn

			await self.accept()
			self.ready = False
			self.room_group_name = f'game_{game_id}'
			await self.channel_layer.group_add(
				self.room_group_name,
				self.channel_name
			)

			if 'invite_denied' in query_params:
				await self.close(self.REQUEST_DENIED)
				return 


			if self.game.user_count == 2:
				raise self.GameFull

			await self._increaseUserCount()
			if self.game.user_count == 2:
				await self.channel_layer.group_send(
					self.room_group_name,
					{
						'type': 'ready_msg',
					}
				)
		except self.ErrorLoggingIn:
			logger.error(f"[Game] - connect: User tried to connect to game socket, but didn't give a game id")
			await self.close(self.ERROR_LOGGING_IN)
			return;
		except self.GameFull:
			logger.error(f"[Game] - connect: User tried to connect to game socket, but game is already full")
			await self.close(self.ERROR_LOGGING_IN)
			return;
		except Exception as e:
			logger.exception(f'exception: {e}')

	@database_sync_to_async
	def _startGame(self):
		self.game.started = True
		self.game.save()

	async def ready_msg(self, event):
		await self._startGame()
		await self.send(text_data=json.dumps({
			'type': 'ready',
		}))

	async def game_info(self, event):
		info = event['info']

		await self.send(text_data=json.dumps({
			'type': 'game_info',
			'info': info,
		}))

	async def disconnect(self, close_code):
		if close_code == self.ERROR_LOGGING_IN:
			await self.send(text_data=json.dumps({
				'error': 'error loggin in',
			}))
		elif close_code == self.REQUEST_DENIED:
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'game_info',
					'info': 'User dennied game invite',
				}
			)
		else:
			try:
				await self.channel_layer.group_send(
					self.room_group_name,
					{
						'type': 'game_info',
						'info': 'Disconect',
					}
				)
				await self._deleteGame()
			except Exception as e:
				logger.exception(f'exception: {e}')
				await self.send(text_data=json.dumps({
						'type': 'error',
						'detail': 'IDFK',
					}))
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		msg_type = text_data_json['type']

		if msg_type == 'move' and self.game.started:
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
		if msg_type == 'game_state':
			stats = text_data_json['stats']
			await self.channel_layer.group_send(
				self.room_group_name,
				{
					'type': 'game_state',
					'stats': stats,
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

	async def game_state(self, event):
		stats = event['stats']

		await self.send(text_data=json.dumps({
			'stats': stats
		}))

	@database_sync_to_async
	def _getGame(self, id):
		return Game.objects.get(id=id)
	
	@database_sync_to_async
	def _increaseUserCount(self):
		self.game.user_count += 1
		self.game.save()
	
	@database_sync_to_async
	def _deleteGame(self):
		self.game.delete()

#todo: it works, maybe rewrite in a better way 
class QueueConsumer(AsyncWebsocketConsumer):
	queue_Pong = []
	queue_Fighty = []
	game_size = 2

	async def connect(self):
		try:
			query_params = self.scope['query_string'].decode()
			if 'game=' in query_params and 'user_id=' in query_params:
				temp = query_params.split('game=')[-1]
				self.game = temp.split('&user_id=')[0]
				self.user_id = temp.split('&user_id=')[1]
			else:
				logger.error(f"[Game] - connect: User tried to connect to game socket, but didn't give a game or user id")
				await self.close()
				return
			
			logger.info(f"game = {self.game}")
			logger.info(f"user_id = {self.user_id}")

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
			else:
				raise Exception("Not a game")
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return	


	async def disconnect(self, close_code):
		if self in self.queue_Pong:
			self.queue_Pong.remove(self)
		if self in self.queue_Fighty:
			self.queue_Fighty.remove(self)


	async def start_game(self):
		try:
			if self.game == 'Pong':
				players = self.queue_Pong[:self.game_size]
				for player in players:
					self.queue_Pong.remove(player)
			elif self.game == 'Fighty':
				players = self.queue_Fighty[:self.game_size]
				for player in players:
					self.queue_Fighty.remove(player)

			data = {
				"player_1": players[0].user_id,
				"player_2": players[1].user_id,
			}
			game = await self.create_game(data)

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
		except Exception as e:
			logger.exception(f'exception: {e}')
			await self.send(text_data=json.dumps({
					'type': 'error',
					'detail': 'IDFK',
				}))
			return	

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
			return game
		except Exception as e:
			logger.exception(f'exception: {e}')
		return None
