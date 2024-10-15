from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .models import GameQueue
from .serializer import QueueSerializer

class QueueViewSet(viewsets.ModelViewSet):
	queryset = GameQueue.objects.all()
	serializer_class = QueueSerializer
	permission_classes = [AllowAny]