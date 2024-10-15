# from django.db import models

# class Tournament(models.Model):
# 	STATUS_CHOICES = [
# 		('upcoming', 'Upcoming'),
# 		('ongoing', 'Ongoing'),
# 		('completed', 'Completed'),
# 	]

# 	game_name = models.CharField(max_length=100)
# 	number_of_players = models.IntegerField(default=4)
# 	players = models.ManyToManyField(User, blank=True, related_name='tournaments')
# 	host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_tournaments')
# 	bracket = models.JSONField(blank=True, null=True)  # Updated JSONField
# 	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='upcoming')

# 	def is_full(self):
# 		return self.players.count() >= self.number_of_players

# 	def add_player(self, user):
# 		if not self.is_full():
# 			self.players.add(user)
# 		else:
# 			raise ValueError("Tournament is full")
