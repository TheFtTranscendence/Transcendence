from rest_framework import serializers
from .models import User
        
class FriendActionSerializer(serializers.Serializer):
    friend_id = serializers.IntegerField()

