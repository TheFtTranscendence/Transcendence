from django.db import models

class Chat(models.Model):
	user1 = models.CharField(max_length=150)
	user2 = models.CharField(max_length=150)
	user1_unread_messages = models.IntegerField(default=0)
	user2_unread_messages = models.IntegerField(default=0)

	def __str__(self):
		return f"Chat between {self.user1_id} and {self.user2_id}"

class Message(models.Model):
	chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
	sender = models.CharField(max_length=150)
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Message from {self.sender_id} at {self.timestamp}"
