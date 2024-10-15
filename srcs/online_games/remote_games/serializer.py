from rest_framework import serializers
from .models import Game, GamePlayer

class GamePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GamePlayer
        fields = ['user', 'skin_id']

class GameSerializer(serializers.ModelSerializer):
    game_players = GamePlayerSerializer(many=True, read_only=True)

    class Meta:
        model = Game
        fields = ['id', 'game_name', 'game_size', 'status', 'is_full', 'game_players']
