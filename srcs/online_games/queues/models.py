from django.db import models
from django.contrib.postgres.fields import ArrayField
import logging

logger = logging.getLogger(__name__)

class GameQueue(models.Model):
	game_name = models.CharField(max_length=100)
	player_list = ArrayField(models.IntegerField(), blank=True, null=True)
	game_size = models.IntegerField(default=2)

	def is_full(self):
		if self.player_list:
			return len(self.player_list) >= self.game_size
		else:
			return False
	
	def add_player(self, user):
		if not self.player_list:
			self.player_list = [user]
			self.save()
		elif not self.is_full() and user not in self.player_list:
			self.player_list.append(user)
			self.save()

	def remove_player(self, user):
		logger.info(self.player_list)
		if self.player_list and user in self.player_list:
			self.player_list.remove(user)
			self.save()
			logger.info(self.player_list)

	def remove_all_player(self):
		self.player_list = None
		self.save()
