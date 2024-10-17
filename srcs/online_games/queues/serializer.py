from rest_framework import serializers
from .models import GameQueue

class QueueSerializer(serializers.ModelSerializer):

	class Meta:
		model = GameQueue
		fields = ['id', 'game_name', 'player_list', 'game_size']
