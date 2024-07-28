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
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 2)
        base_gas = contract.functions.addInstance().estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 2)

        # Build the transaction
        tx = contract.functions.addInstance().build_transaction({
            'chainId': 11155111,
            'gas': gas,
            'gasPrice': gas_price,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash
    
    try:
        tx_hash = add_instance_func()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    logs = contract.events.InstanceAdded().process_receipt(tx_receipt)
    instance_index = logs[0]['args']['instanceIndex']  # Adjust based on your event arguments

    return JsonResponse({'message': instance_index}, status=200)

# Add a game
@api_view(['POST'])
def add_game(request, instanceIndex):
    data = request.data
    player1 = data.get('player1')
    player2 = data.get('player2')
    score1 = data.get('score1')
    score2 = data.get('score2')

    if player1 is None or player2 is None or score1 is None or score2 is None:
        return JsonResponse({'message': 'Missing data'}, status=400)

    def add_game_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 2)
        base_gas = contract.functions.addGame(instanceIndex, player1, player2, score1, score2).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 2)

        # Build the transaction
        tx = contract.functions.addGame(instanceIndex, player1, player2, score1, score2).build_transaction({
            'chainId': 11155111,
            'gas': gas,
            'gasPrice': gas_price,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    try:
        tx_hash = add_game_func()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'message': 'Game added'}, status=200)

# Add tournament (4 or 8 players)
@api_view(['POST'])
def add_tournament(request, instanceIndex):
    data = request.data
    players = data.get('players')

    if players is None:
        return JsonResponse({'message': 'Missing data'}, status=400)

    def add_tournament_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 2)
        base_gas = contract.functions.addTournament(instanceIndex, players).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 2)

        # Build the transaction
        tx = contract.functions.addTournament(instanceIndex, players).build_transaction({
            'chainId': 11155111,
            'gas': gas,
            'gasPrice': gas_price,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    try:
        tx_hash = add_tournament_func()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'message': 'Tournament added'}, status=200)

# Add a tournament game
@api_view(['POST'])
def add_tournament_game(request, instanceIndex):
    data = request.data
    player1 = data.get('player1')
    player2 = data.get('player2')
    score1 = data.get('score1')
    score2 = data.get('score2')

    if player1 is None or player2 is None or score1 is None or score2 is None:
        return JsonResponse({'message': 'Missing data'}, status=400)

    def add_tournament_game_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 2)
        base_gas = contract.functions.addTournamentGame(instanceIndex, player1, player2, score1, score2).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 2)

        # Build the transaction
        tx = contract.functions.addTournamentGame(instanceIndex, player1, player2, score1, score2).build_transaction({
            'chainId': 11155111,
            'gas': gas,
            'gasPrice': gas_price,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    try:
        tx_hash = add_tournament_game_func()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'message': 'Tournament game added'}, status=200)

### GETTER FUNCTIONS ###

# Get all the games from an instance (for the history)
@api_view(['GET'])
def get_games(request, instanceIndex):
    try:
        games = contract.functions.getGames(instanceIndex).call()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    return JsonResponse({'games': games}, status=200)

# Get the next tournament game to play (returns 2 players)
@api_view(['GET'])
def get_next_tournament_player(request, instanceIndex):
    try:
        players = contract.functions.getNextTournamentPlayers(instanceIndex).call()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    return JsonResponse({'players': players}, status=200)

# Get a tournament ranking
@api_view(['GET'])
def get_tournament_ranking(request, instanceIndex, tournamentIndex):
    try:
        ranking = contract.functions.getTournamentRanking(instanceIndex, tournamentIndex).call()
    except Exception as e:
        return JsonResponse({'message': str(e)}, status=400)

    return JsonResponse({'ranking': ranking}, status=200)
