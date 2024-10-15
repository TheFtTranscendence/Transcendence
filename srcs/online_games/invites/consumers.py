import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import GameInvite, GameInviteSingle
from remote_games.models import Game
import logging

logger = logging.getLogger(__name__)

class InviteConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user_id = self.scope['url_route']['kwargs']['user_id']
		self.group_name = f'user_{self.user_id}'

		await self.channel_layer.group_add(
			self.group_name,
			self.channel_name
		)
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.group_name,
			self.channel_name
		)
		await self.close(close_code)

	async def receive(self, text_data):
		data = json.loads(text_data)
		action = data.get('action')

		if action == 'invite':
			receivers = data.get('receivers')
			game_name = data.get('game_name')
			game_size = data.get('game_size')
			await self.create_invite(receivers, game_name, game_size)
		elif action == 'response':
			invite_id = data.get('invite_id')
			response = data.get('response')
			if response == 'accept':
				await self.accept_invite(invite_id)
			elif response == 'deny':
				await self.deny_invite(invite_id)
		else:
			await self.send(text_data=json.dumps({'error': 'Unknown action.'}))

	async def create_invite(self, receivers, game_name, game_size):
		try:
			invite = await sync_to_async(GameInvite.objects.create)(game_name=game_name, game_size=game_size, sender=self.user_id, receivers=receivers)

			for receiver_id in receivers:
				await sync_to_async(GameInviteSingle.objects.create)(
					invite=invite,
					receiver=receiver_id
				)
				await self.channel_layer.group_send(
				f'user_{receiver_id}', {
					'type': 'game_invite_message',
					'game_name': game_name,
					'invite_id': invite.id,
					'game_size': game_size,
					'sender_id': self.user_id,
				})
		except Exception as e:
			await self.send(text_data=json.dumps({'error': str(e)}))
		
	async def game_invite_message(self, event):
		game_name = event['game_name']
		invite_id = event['invite_id']
		game_size = event['game_size']
		sender_id = event['sender_id']

		await self.send(text_data=json.dumps({
			'type': 'game_invite_message',
			'game_name': game_name,
			'invite_id': invite_id,
			'game_size': game_size,
			'sender_id': sender_id,			
		}))

	async def accept_invite(self, invite_id):
		try:

			single_invite = await sync_to_async(GameInviteSingle.objects.get)(invite_id=invite_id, receiver=self.user_id)
			await sync_to_async(single_invite.accept)()

			invite = await sync_to_async(lambda: single_invite.invite)()
			sender = await sync_to_async(lambda: invite.sender)()

			await self.channel_layer.group_send(
				f'user_{sender}', {
					'type': 'invite_response_message',
					'invite_id': invite_id,
					'response': 'accept',
					'receiver_id': self.user_id,
				})

			all_accepted = await sync_to_async(invite.check_all_accepted)()
			if all_accepted:
				game = await sync_to_async(Game.objects.create)(game_name=invite.game_name, game_size=invite.game_size)
				
				await self.channel_layer.group_send(
					f'user_{invite.sender}', {
						'type': 'game_ready_message',
						'game_name': game.game_name,
						'game_id': game.id,
					})
				receivers = await sync_to_async(lambda: list(invite.receivers))()
				for receiver in receivers:
					await self.channel_layer.group_send(
						f'user_{receiver}', {
							'type': 'game_ready_message',
							'game_name': game.game_name,
							'game_id': game.id,
						})
					
		except GameInviteSingle.DoesNotExist:
			await self.send(text_data=json.dumps({'error': 'Invite not found for this user.'}))
		except Exception as e:
			await self.send(text_data=json.dumps({'error': str(e)}))

	async def game_ready_message(self, event):
		game_name = event['game_name']
		game_id = event['game_id']

		await self.send(text_data=json.dumps({
			'type': 'game_ready_message',
			'message': 'Game is ready',
			'game_name': game_name,
			'game_id': game_id,
		}))

	async def deny_invite(self, invite_id):
		try:
			single_invite = await sync_to_async(GameInviteSingle.objects.get)(invite_id=invite_id, receiver=self.user_id)
			await sync_to_async(single_invite.deny)()

			invite = await sync_to_async(lambda: single_invite.invite)()
			sender = await sync_to_async(lambda: invite.sender)()
			
			await self.channel_layer.group_send(
				f'user_{sender}', {
					'type': 'invite_response_message',
					'invite_id': invite_id,
					'response': 'accept',
					'receiver_id': self.user_id,
				})
			receivers = await sync_to_async(lambda: invite.receivers)()
			for receiver_id in receivers:
				await self.channel_layer.group_send(
					f'user_{receiver_id}', {
						'type': 'invite_response_message',
						'invite_id': invite_id,
						'response': 'accept',
						'receiver_id': self.user_id,
					})

		except GameInviteSingle.DoesNotExist:
			await self.send(text_data=json.dumps({'error': 'Invite not found for this user.'}))
		except Exception as e:
			await self.send(text_data=json.dumps({'error': str(e)}))

	async def invite_response_message(self, event):
		invite_id = event['invite_id']
		response = event['response']
		receiver_id = event['receiver_id']

		await self.send(text_data=json.dumps({
			'type': 'invite_response_message',
			'invite_id': invite_id,
			'response': response,
			'receiver_id': receiver_id,
		}))
