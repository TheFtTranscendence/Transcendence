from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import FriendRequest
from .serializers import FriendRequestSerializer

class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
