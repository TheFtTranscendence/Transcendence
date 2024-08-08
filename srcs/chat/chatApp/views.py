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

	@csrf_exempt
	@action(detail=False, methods=['post'])
	def create_chat(self, request):
		user1_id = request.data['user1_id']
		user2_id = request.data['user2_id']
		chat = Chat.objects.filter(
			(Q(user1_id=user1_id) & Q(user2_id=user2_id)) | 
			(Q(user1_id=user2_id) & Q(user2_id=user1_id))
		).first()
		if not chat:
			chat = Chat.objects.create(user1_id=user1_id, user2_id=user2_id)
		serializer = self.get_serializer(chat)
		return Response(serializer.data)
			

class MessageViewSet(viewsets.ModelViewSet):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer
	permission_classes = [AllowAny]

	def perform_create(self, serializer):
		sender_id = self.request.data.get('sender_id')
		serializer.save(sender_id=sender_id)

