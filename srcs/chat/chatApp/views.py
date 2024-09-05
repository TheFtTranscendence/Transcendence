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
		user1 = request.data['user1']
		user2 = request.data['user2']
		chat = Chat.objects.filter(
			(Q(user1=user1) & Q(user2=user2)) | 
			(Q(user1=user2) & Q(user2=user1))
		).first()
		if not chat:
			chat = Chat.objects.create(user1=user1, user2=user2)
		serializer = self.get_serializer(chat)
		if (chat.user1 == user1):
			chat.user1_unread_messages = 0
		else:
			chat.user2_unread_messages = 0
		chat.save()			
		return Response(serializer.data)
			

class MessageViewSet(viewsets.ModelViewSet):
	queryset = Message.objects.all()
	serializer_class = MessageSerializer
	permission_classes = [AllowAny]
	http_method_names = ['patch', 'delete']

	def perform_create(self, serializer):
		sender = self.request.data.get('sender')
		serializer.save(sender=sender)

