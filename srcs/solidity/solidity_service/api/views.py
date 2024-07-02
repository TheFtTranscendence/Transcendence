from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .web3_utils import get_number_of_games, add_game

# Add an instance (it returns the instance index)

# Add a game
@api_view(['POST'])
def add_new_game(request):
    instance_index = request.data.get('instance_index')
    player1 = request.data.get('player1')
    player2 = request.data.get('player2')
    score1 = request.data.get('score1')
    score2 = request.data.get('score2')
    # tx_hash = await add_game(instance_index, player1, player2, score1, score2)
    return JsonResponse({'message': 'Game added'}, status=200)

# Add tournament (4 or 8 players)

# Add a tournament game (it also adds it to the array of games with a index of the tournament)

# Get the number of games
@api_view(['GET'])
def get_games(request, instance_index):
    # number_of_games = await get_number_of_games(instance_index)
    return JsonResponse({'number_of_games': number_of_games}, status=200)

# Get all the games (for the history)

# Get the next tournament game to play (returns 2 players)

# Get a tournament ranking