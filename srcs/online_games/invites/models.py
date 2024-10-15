from django.db import models
from django.contrib.postgres.fields import ArrayField
from asgiref.sync import sync_to_async

import logging

logger = logging.getLogger(__name__)

class GameInvite(models.Model):
	game_name = models.CharField(max_length=100)
	game_size = models.IntegerField(default=2)
	sender = models.IntegerField()
	receivers = ArrayField(models.IntegerField(), blank=True, null=True)

	def check_all_accepted(self):
		invites = GameInviteSingle.objects.filter(invite=self)
		for single_invite in invites:
			if single_invite.status in ['pending', 'rejected']:
				return False
		return True

class GameInviteSingle(models.Model):
	STATUS_CHOICES = [
		('pending', 'Pending'),
		('accepted', 'Accepted'),
		('rejected', 'Rejected'),
	]

	invite = models.ForeignKey(GameInvite, on_delete=models.CASCADE)
	receiver = models.IntegerField()
	status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

	def accept(self):
		self.status = 'accepted'
		self.save()

	def deny(self):
		self.status = 'rejected'
		self.save()