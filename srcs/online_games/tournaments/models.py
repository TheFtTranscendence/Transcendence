from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models import Q

#todo: add to the creation and the post of games's response the next 2 players

class Tournament(models.Model):
	STATUS_CHOICES = [
		('ongoing', 'Ongoing'),
		('completed', 'Completed'),
		('aborted', 'Aborted'),
	]

	game_name = models.CharField(max_length=100)
	number_of_players = models.IntegerField(default=4)
	host = models.IntegerField()
	player_list = ArrayField(models.CharField(max_length=100), blank=True, null=True)
	player_info = ArrayField(models.JSONField(blank=True, null=True), blank=True, null=True)
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ongoing')

	def change_status(self, new_status):
		if new_status in dict(self.STATUS_CHOICES):
			self.status = new_status
			self.save()
		else:
			raise ValueError(f"Invalid status: {new_status}")
		
	class Meta:
		constraints = [
			models.UniqueConstraint(
				fields=['host', 'game_name'], 
				name='unique_ongoing_tournament', 
				condition=Q(status='ongoing')
			)
		]

class TournamentGame(models.Model):
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament_game')
	users = ArrayField(models.CharField(max_length=100), blank=True, null=True)
	timestamp = models.DateTimeField(auto_now_add=True)
	scores = ArrayField(models.IntegerField(), blank=True, null=True)
