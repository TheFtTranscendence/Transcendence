from rest_framework import serializers
from .models import Chat, Message

class MessageSerializer(serializers.ModelSerializer):
	class Meta:
		model = Message
		fields = ['id', 'chat', 'sender_id', 'content', 'timestamp']

class ChatSerializer(serializers.ModelSerializer):
	messages = MessageSerializer(many=True, read_only=True)
	
	class Meta:
		model = Chat
		fields = ['id', 'user1_id', 'user2_id', 'messages']
