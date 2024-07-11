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

# def add_instance(request):
#     def add_instance_func():
#         try:
#             # Send the transaction using `transact`
#             tx_hash = contract.functions.addInstance().transact({
#                 'from': web3.eth.default_account,
#                 'gas': 2000000,
#                 'gasPrice': web3.toWei('50', 'gwei')
#             })
            
#             return tx_hash
#         except Exception as e:
#             # Catch all other exceptions and log them
#             print(f"Exception: {e}")
#             raise

#     # Call the add_instance_func to get the transaction hash
#     try:
#         tx_hash = add_instance_func()
#         # Return the transaction hash in the response
#         return JsonResponse({'message': 'Instance added with tx hash: ' + tx_hash.hex()}, status=200)
#     except Exception as e:
#         return JsonResponse({'error': str(e)}, status=500)

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
    
    # Still need to get and return the instance index

    tx_hash = add_instance_func()
    return JsonResponse({'message': 'Instance added, instance number is: '}, status=200)

# Add a game
@api_view(['POST'])
def add_new_game(request, instanceIndex):
    def add_new_game_func():
        instance_index = instanceIndex
        player1 = request.data.get('player1')
        player2 = request.data.get('player2')
        score1 = request.data.get('score1')
        score2 = request.data.get('score2')
        tx = contract.functions.addGame(instance_index, player1, player2, score1, score2).build_transaction({
            'chainId': 11155111,
            'gas': 2000000,
            'gasPrice': web3.toWei('50', 'gwei'),
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.sendRawTransaction(signed_tx.rawTransaction)
        return tx_hash

    tx_hash = add_new_game_func()
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
def get_number_of_games(request, instance_index):
    number_of_games = contract.functions.getNumberOfGames(instance_index).call()
    return JsonResponse({'number_of_games': number_of_games}, status=200)

# Get all the games (for the history)

# Get the next tournament game to play (returns 2 players)

# Get a tournament ranking
