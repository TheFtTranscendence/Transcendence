from rest_framework.response import Response
from rest_framework.decorators import api_view
from .web3_utils import get_number_of_games, add_game

@api_view(['GET'])
def get_games(request, instance_index):
    number_of_games = get_number_of_games(instance_index)
    return Response({'number_of_games': number_of_games})

@api_view(['POST'])
def add_new_game(request):
    instance_index = request.data.get('instance_index')
    player1 = request.data.get('player1')
    player2 = request.data.get('player2')
    score1 = request.data.get('score1')
    score2 = request.data.get('score2')
    tx_hash = add_game(instance_index, player1, player2, score1, score2)
    return Response({'tx_hash': tx_hash})
