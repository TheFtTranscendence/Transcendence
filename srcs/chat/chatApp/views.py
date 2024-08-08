from rest_framework import viewsets
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from django.db.models import Q

class ChatViewSet(viewsets.ModelViewSet):
	queryset = Chat.objects.all()
	serializer_class = ChatSerializer
	permission_classes = [AllowAny]

	@action(detail=False, methods=['post'])
	def create_chat(self, request):
		user1_id = request.data['user1_id']
		user2_id = request.data['user2_id']
		chat, created = Chat.objects.get_or_create(user1_id=user1_id, user2_id=user2_id)
		if not created:
			chat, created = Chat.objects.get_or_create(user1_id=user2_id, user2_id=user1_id)
		serializer = self.get_serializer(chat)
		return Response(serializer.data)

class MessageViewSet(viewsets.ModelViewSet):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer
	permission_classes = [AllowAny]

	def perform_create(self, serializer):
		sender_id = self.request.data.get('sender_id')
		serializer.save(sender_id=sender_id)

	@action(detail=False, methods=['get'], url_path='by_users/(?P<user1_id>[^/.]+)/(?P<user2_id>[^/.]+)')
	def by_users(self, request, user1_id=None, user2_id=None):
		chat = Chat.objects.get(user1_id=user1_id, user2_id=user2_id)
		if not chat:
			chat = Chat.objects.get(user1_id=user2_id, user2_id=user1_id)
		# chat = Chat.objects.filter(
		# 	(Q(user1_id=user1_id) & Q(user2_id=user2_id)) |
		# 	(Q(user1_id=user2_id) & Q(user2_id=user1_id))
		# ).first()

		if chat is not None:
			messages = self.queryset.filter(chat_id=chat.id)
			serializer = self.get_serializer(messages, many=True)
			return Response(serializer.data)
		else:
			return Response({"detail": "Chat not found"}, status=404)
