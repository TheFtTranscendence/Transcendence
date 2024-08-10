from django.db import models

class Chat(models.Model):
	user1_id = models.IntegerField()
	user2_id = models.IntegerField()

	def __str__(self):
		return f"Chat between {self.user1_id} and {self.user2_id}"

class Message(models.Model):
	chat_id = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name='messages')
	sender_id = models.IntegerField()
	content = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"Message from {self.sender_id} at {self.timestamp}"
