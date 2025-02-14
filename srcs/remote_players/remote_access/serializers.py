from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Game
		fields = ['id', 'player_1', 'player_2', 'user_count', 'started']

