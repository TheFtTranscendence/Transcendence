from django.db import models

class Game(models.Model):
	player_1 = models.IntegerField()
	player_2 = models.IntegerField()