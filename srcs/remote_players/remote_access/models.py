from django.db import models

class Game(models.Model):
	user1_id = models.IntegerField()
	user2_id = models.IntegerField()