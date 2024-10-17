from rest_framework.permissions import AllowAny
from rest_framework import viewsets
from .models import GameInvite
from .serializer import GameInviteSerializer

class GameInviteViewSet(viewsets.ModelViewSet):
	queryset = GameInvite.objects.all()
	serializer_class = GameInviteSerializer
	permission_classes = [AllowAny]