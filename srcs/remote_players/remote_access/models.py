from django.db import models

class Game(models.Model):
	player_1 = models.IntegerField()
	player_2 = models.IntegerField()
	user_count = models.IntegerField(default=0, blank=True, null=True)
	started = models.BooleanField(default=False, blank=True, null=True)