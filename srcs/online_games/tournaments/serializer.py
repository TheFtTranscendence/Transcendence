from rest_framework import serializers
from .models import Tournament, TournamentGame
from django.db import IntegrityError

import math
def is_power_of_two(n):
	if n <= 0:
		return False
	log_value = math.log2(n)
	return log_value.is_integer()

class TournamentGameSerializer(serializers.ModelSerializer):
	class Meta:
		model = TournamentGame
		fields = ['id', 'users', 'scores']

class TournamentSerializer(serializers.ModelSerializer):
	tournament_games = TournamentGameSerializer(many=True, read_only=True, source='tournament_game')

	class Meta:
		model = Tournament
		fields = ['id', 'game_name', 'number_of_players', 'host', 'player_list', 'status', 'tournament_games', 'player_info']

	def validate_number_of_players(self, value):
		if value < 4:
			raise serializers.ValidationError("Number of players must be at least 2")
		if not is_power_of_two(value):
			raise serializers.ValidationError("Number of players should be a power of 2")
		return value

	def validate_player_list(self, value):
		if not value:
			raise serializers.ValidationError("Player list cannot be empty.")
		if len(value) != len(set(value)):
			raise serializers.ValidationError("Player list cannot contain duplicates.")
		return value
	
	def validate(self, data):
		if len(data['player_list']) != data['number_of_players']:
			raise serializers.ValidationError("The number of players in player_list must match number_of_players.")
		if len(data['player_info']) != data['number_of_players']:
			raise serializers.ValidationError("The number of players in player_info must match number_of_players.")
		return data
	
	def create(self, validated_data):
		try:
			return super().create(validated_data)
		except IntegrityError:
			raise serializers.ValidationError("An ongoing tournament with this host and game name already exists.")