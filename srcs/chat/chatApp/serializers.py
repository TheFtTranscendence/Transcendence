from rest_framework import serializers
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
	class Meta:
		model = Chat
		fields = ['id', 'user1_id', 'user2_id']

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ['id', 'chat', 'sender_id', 'content', 'timestamp']
