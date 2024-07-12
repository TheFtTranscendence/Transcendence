from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

import json
from web3 import Web3, HTTPProvider
from django.conf import settings

# Get from settings
ethereum_node_url = settings.ETHEREUM_NODE_URL
contract_address = settings.CONTRACT_ADDRESS
private_key = settings.PRIVATE_KEY

# Initialize Web3
web3 = Web3(HTTPProvider(ethereum_node_url))
account = web3.eth.account.from_key(private_key)  # Correct method
web3.eth.default_account = account.address  # Set the default account

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
    def add_instance_func():
        tx = contract.functions.addInstance().build_transaction({
            'chainId': 11155111,
            'gas': 2000000,
            'gasPrice': web3.to_wei('50', 'gwei'),
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash
    
    tx_hash = add_instance_func()

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    logs = contract.events.InstanceAdded().process_receipt(tx_receipt)
    instance_index = logs[0]['args']['instanceIndex']  # Adjust based on your event arguments

    return JsonResponse({'message': f'Instance added, instance number is: {instance_index}'}, status=200)

# Add a game
@api_view(['POST'])
def add_new_game(request, instanceIndex):
    data = request.data
    player1 = data.get('player1')
    player2 = data.get('player2')
    score1 = data.get('score1')
    score2 = data.get('score2')

    if not all([player1, player2, score1, score2]):
        return JsonResponse({'message': 'Missing data'}, status=400)

    def add_new_game_func():
        tx = contract.functions.addGame(instanceIndex, player1, player2, score1, score2).build_transaction({
            'chainId': 11155111,
            'gas': 2000000,
            'gasPrice': web3.to_wei('50', 'gwei'),
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    tx_hash = add_new_game_func()

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'message': 'Game added'}, status=200)

# Add tournament (4 or 8 players)

# Add a tournament game (it also adds it to the array of games with a index of the tournament)

### GETTER FUNCTIONS ###

# Get the value of the uint256 public variable instanceIndex
@api_view(['GET'])
def get_instance_index(request):
    instance_index = contract.functions.instanceIndex().call()
    return JsonResponse({'instance_index': instance_index}, status=200)

# Get the number of games
@api_view(['GET'])
def get_number_of_games(request, instanceIndex):
    number_of_games = contract.functions.getNumberOfGames(instanceIndex).call()
    return JsonResponse({'number_of_games': number_of_games}, status=200)

# Get all the games (for the history)

# Get the next tournament game to play (returns 2 players)

# Get a tournament ranking
