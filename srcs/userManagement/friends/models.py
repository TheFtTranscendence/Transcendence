# models.py
from django.db import models
from authentication.models import User

class FriendRequest(models.Model):
	sender = models.ForeignKey(User, related_name='sent_requests', on_delete=models.CASCADE)
	receiver = models.ForeignKey(User, related_name='received_requests', on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	accepted = models.BooleanField(default=False)
	rejected = models.BooleanField(default=False)
