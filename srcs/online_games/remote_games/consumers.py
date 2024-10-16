import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Game, GamePlayer
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import logging

logger = logging.getLogger(__name__)

class GameConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.game_id = self.scope['url_route']['kwargs']['id']
		self.game_group_name = f'game_{self.game_id}'

		try:
			self.game = await sync_to_async(Game.objects.get)(id=self.game_id)
			# game_is_full = await sync_to_async(self.game.is_full)()
			# if game_is_full:
			# 	await self.send(text_data=json.dumps({'error': "Cannot add player because game is already full."}))
			# 	return ;
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

	async def disconnect(self, close_code, score=None):
		try:
			# if close_code == 3000 and self.game.status == 'ongoing':
			# 	for players in self.game.game_players.all():
			# 		#todo: upload the game to the block_chain
			# 	await sync_to_async(self.game.change_status)('completed')

			game_player = await GamePlayer.objects.get(user=self.user, game=self.game)
			game_player.delete()


			self.close(close_code)
		except GamePlayer.DoesNotExist:
			await self.send(text_data=json.dumps({
				'error': 'User not in the game.'
			}))

		await self.channel_layer.group_discard(
			self.game_group_name,
			self.channel_name
		)

	async def receive(self, text_data):
		data = json.loads(text_data)
		action = data.get('action')

		if action == 'ready':
			user = data.get('user')
			username = data.get('username')
			blockchain_id = data.get('blockchain_id')
			user_info = data.get('user_info')
			await self.handle_ready(user, username, blockchain_id, user_info)
		elif action == 'leave':
			score = data.get('score')
			await self.disconnect(3000, score)
		elif action == 'move' and self.game.status == 'ongoing':
			move = data.get('move')
			await self.handle_move(move)
		elif action == 'move':
			await self.send(text_data=json.dumps({'error': 'WTF?'}))
		elif action == 'game_info' and self.game.status == 'ongoing':
			info = data.get('info')
			await self.handle_game_info(info)
		else:
			await self.send(text_data=json.dumps({'error': 'Unknown action.'}))

	async def handle_game_info(self, info):
		await self.channel_layer.group_send(
			self.game_group_name,
			{
				'type': 'game_info_message',
				'info': info
			}
		)

	async def game_info_message(self, event):
		info = event['info']

		await self.send(text_data=json.dumps({
			'type': 'game_info',
			'sender_id': self.user,
			'action': info
		}))

	async def handle_move(self, move):
		await self.channel_layer.group_send(
			self.game_group_name,
			{
				'type': 'move_message',
				'move': move
			}
		)

	async def move_message(self, event):
		move = event['move']

		await self.send(text_data=json.dumps({
			'type': 'move',
			'sender_id': self.user,
			'move': move
		}))

	async def handle_ready(self, user, username, blockchain_id, user_info):
		try:
			self.user = user
			await sync_to_async(self.game.add_player)(self.user, username, blockchain_id, user_info)

			all_ready = await sync_to_async(self.game.is_full)()
			if all_ready:
				players = await sync_to_async(list)(self.game.game_players.all())

				player_list = []
				for player in players:
					player_dict = {
						'user': player.user,
						'username': player.username,
						'user_info': player.user_info
					}
					player_list.append(player_dict)
				
				await self.channel_layer.group_send(
					self.game_group_name,
					{
						'type': 'game_ready_message',
						'users_info': player_list
					}
				)

				await sync_to_async(self.game.change_status)('ongoing')
				return
			
		except Exception as e:
			logger.info(f"error: {e}")
			await self.send(text_data=json.dumps({'error': str(e)}))

	async def game_ready_message(self, event):
		users_info = event['users_info']

		await self.send(text_data=json.dumps({
			'type': 'GameReady',
			'users_info': users_info
		}))
