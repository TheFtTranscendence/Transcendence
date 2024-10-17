from django.db import models
from django.contrib.postgres.fields import ArrayField

class Game(models.Model):
	STATUS_CHOICES = [
		('upcoming', 'Upcoming'),
		('ongoing', 'Ongoing'),
		('completed', 'Completed'),
	]

	game_name = models.CharField(max_length=100)
	game_size = models.IntegerField(default=2)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming')

	def is_full(self):
		return self.game_players.count() >= self.game_size
	
	def change_status(self, new_status):
		if new_status in dict(self.STATUS_CHOICES):
			self.status = new_status
			self.save()
		else:
			raise ValueError(f"Invalid status: {new_status}")
		
	def add_player(self, player_id, username, blockchain_id, user_info):
		if self.is_full():
			raise ValueError("Cannot add player because game is already full.")
		if GamePlayer.objects.filter(game=self, user=player_id).exists():
			raise ValueError("Player is already in this game.")
		
		GamePlayer.objects.create(
			game=self,
			user=player_id,
			username=username,
			blockchain_id=blockchain_id,
			user_info=user_info
		)

class GamePlayer(models.Model):
	user = models.IntegerField()
	blockchain_id = models.IntegerField(blank=True, null=True)
	username = models.CharField(max_length=100)
	game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='game_players')
	user_info = models.JSONField(blank=True, null=True)
