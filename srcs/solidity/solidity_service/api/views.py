from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

import asyncio
import json
from web3 import Web3, AsyncHTTPProvider
from django.conf import settings

# Helper function to execute async functions synchronously
def run_async(func, *args):
    return asyncio.run(func(*args))

# Get from settings
ethereum_node_url = settings.ETHEREUM_NODE_URL
contract_address = settings.CONTRACT_ADDRESS
private_key = settings.PRIVATE_KEY

# Initialize Web3
web3 = Web3(AsyncHTTPProvider(ethereum_node_url))

# Load the contract ABI
with open('/usr/src/app/Score.json') as f:
    contract_abi_list = json.load(f)
    print("Loaded JSON content:", contract_abi_list)  # Debugging line
    
    # Assuming it's an array of ABIs
    contract_abi = contract_abi_list
    
contract = web3.eth.contract(address=contract_address, abi=contract_abi)


### SETTER FUNCTIONS ###

# Add an instance (it returns the instance index)
@api_view(['POST'])
def add_instance(request):
    async def add_instance_async():
        tx = contract.functions.addInstance().buildTransaction({
            'chainId': 11155111,
            'gas': 2000000,
            'gasPrice': web3.toWei('50', 'gwei'),
            'nonce': await web3.eth.getTransactionCount(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = await web3.eth.sendRawTransaction(signed_tx.rawTransaction)
        return tx_hash
    
    tx_hash = run_async(add_instance_async)
    return JsonResponse({'message': 'Instance added with tx hash: ' + tx_hash.hex()}, status=200)

# Add a game
@api_view(['POST'])
def add_new_game(request):
    async def add_new_game_async():
        instance_index = request.data.get('instance_index')
        player1 = request.data.get('player1')
        player2 = request.data.get('player2')
        score1 = request.data.get('score1')
        score2 = request.data.get('score2')
        tx = contract.functions.addGame(instance_index, player1, player2, score1, score2).buildTransaction({
            'chainId': 11155111,
            'gas': 2000000,
            'gasPrice': web3.toWei('50', 'gwei'),
            'nonce': await web3.eth.getTransactionCount(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = run_async(web3.eth.sendRawTransaction, signed_tx.rawTransaction)
        return tx_hash

    tx_hash = run_async(add_new_game_async)
    return JsonResponse({'message': 'Game added'}, status=200)

# Add tournament (4 or 8 players)

# Add a tournament game (it also adds it to the array of games with a index of the tournament)

### GETTER FUNCTIONS ###

# Get the value of the uint256 public variable instanceIndex
@api_view(['GET'])
def get_instance_index(request):
    async def get_instance_index_async():
        instance_index = await contract.functions.instanceIndex().call()
        return instance_index

    instance_index = run_async(get_instance_index_async)
    return JsonResponse({'instance_index': instance_index}, status=200)

# Get the number of games
@api_view(['GET'])
def get_number_of_games(request, instance_index):
    async def get_number_of_games_async(instance_index):
        number_of_games = await contract.functions.getNumberOfGames(instance_index).call()
        return number_of_games

    number_of_games = run_async(get_number_of_games_async, instance_index)
    return JsonResponse({'number_of_games': number_of_games}, status=200)

# Get all the games (for the history)

# Get the next tournament game to play (returns 2 players)

# Get a tournament ranking