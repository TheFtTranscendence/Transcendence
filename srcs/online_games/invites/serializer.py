from rest_framework import serializers
from .models import GameInviteSingle, GameInvite

class GameInviteSingleSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameInviteSingle
        fields = ['invite', 'receiver', 'status']

class GameInviteSerializer(serializers.ModelSerializer):
    receivers = GameInviteSingleSerializer(many=True, read_only=True, source='gameinvitesingle_set')  # Use the related name

    class Meta:
        model = GameInvite
        fields = ['id', 'game', 'sender', 'receivers']