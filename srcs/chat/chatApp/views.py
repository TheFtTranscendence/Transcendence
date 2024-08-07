from rest_framework import viewsets
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny

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
		serializer.save(sender_id=self.request.user.id)
