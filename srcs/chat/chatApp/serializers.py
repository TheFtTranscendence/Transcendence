from rest_framework import serializers
from .models import Chat, Message

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ['id', 'chat', 'sender', 'content', 'timestamp']

class ChatSerializer(serializers.ModelSerializer):
	messages = MessageSerializer(many=True, read_only=True)
	
	class Meta:
		model = Chat
		fields = ['id', 'user1', 'user2', 'user1_unread_messages', 'user2_unread_messages', 'messages']
