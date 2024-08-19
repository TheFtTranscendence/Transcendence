from rest_framework import viewsets
from .models import Game
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .serializers import GameSerializer

class GameViewSet(viewsets.ModelViewSet):
	queryset = Game.objects.all()
	serializer_class = GameSerializer
	permission_classes = [AllowAny]
	http_method_names = ['post', 'get', 'delete']

