from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

import json
from web3 import Web3, HTTPProvider
from django.conf import settings
import time

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
        gas_price = int(base_gas_price * 3)
        base_gas = contract.functions.addInstance().estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 5)
        max_priority_fee_per_gas = web3.to_wei(200, 'gwei')  # 0.005 ETH in Gwei
        max_fee_per_gas = base_gas_price + max_priority_fee_per_gas

        # Build the transaction
        tx = contract.functions.addInstance().build_transaction({
            'chainId': 17000,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,  # Fixed tip of 0.005 ETH
            'maxFeePerGas': max_fee_per_gas,
            'gas': gas,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash
    
    while True:
        pending_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'pending')
        latest_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'latest')
        if pending_nonce == latest_nonce:
            break
        time.sleep(5)

    try:
        tx_hash = add_instance_func()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    logs = contract.events.InstanceAdded().process_receipt(tx_receipt)
    instance_index = logs[0]['args']['instanceIndex']  # Adjust based on your event arguments

    return JsonResponse({'success': instance_index}, status=200)

# Add a game
@api_view(['POST'])
def add_game(request, instanceIndex, gameType):
    data = request.data
    player1 = data.get('player1')
    player2 = data.get('player2')
    score1 = data.get('score1')
    score2 = data.get('score2')

    if player1 is None or player2 is None or score1 is None or score2 is None:
        return JsonResponse({'missing fields': 'Data isnt format as expected'}, status=450)

    def add_game_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 3)
        base_gas = contract.functions.addGame(instanceIndex, gameType, player1, player2, score1, score2).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 5)
        max_priority_fee_per_gas = web3.to_wei(200, 'gwei')  # 0.005 ETH in Gwei
        max_fee_per_gas = base_gas_price + max_priority_fee_per_gas

        # Build the transaction
        tx = contract.functions.addGame(instanceIndex, gameType, player1, player2, score1, score2).build_transaction({
            'chainId': 17000,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,  # Fixed tip of 0.005 ETH
            'maxFeePerGas': max_fee_per_gas,
            'gas': gas,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    while True:
        pending_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'pending')
        latest_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'latest')
        if pending_nonce == latest_nonce:
            break
        time.sleep(5)

    try:
        tx_hash = add_game_func()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'success': 'Game added'}, status=200)

# Add tournament (4 or 8 players)
@api_view(['POST'])
def add_tournament(request, instanceIndex, gameType):
    data = request.data
    players = data.get('players')

    if players is None:
        return JsonResponse({'missing fields': 'Data isnt format as expected'}, status=450)

    def add_tournament_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 3)
        base_gas = contract.functions.addTournament(instanceIndex, gameType, players).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 5)
        max_priority_fee_per_gas = web3.to_wei(200, 'gwei')  # 0.005 ETH in Gwei
        max_fee_per_gas = base_gas_price + max_priority_fee_per_gas

        # Build the transaction
        tx = contract.functions.addTournament(instanceIndex, gameType, players).build_transaction({
            'chainId': 17000,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,  # Fixed tip of 0.005 ETH
            'maxFeePerGas': max_fee_per_gas,
            'gas': gas,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    while True:
        pending_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'pending')
        latest_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'latest')
        if pending_nonce == latest_nonce:
            break
        time.sleep(5)

    try:
        tx_hash = add_tournament_func()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'success': 'Tournament added'}, status=200)

# Add a tournament game
@api_view(['POST'])
def add_tournament_game(request, instanceIndex, gameType):
    data = request.data
    player1 = data.get('player1')
    player2 = data.get('player2')
    score1 = data.get('score1')
    score2 = data.get('score2')

    if player1 is None or player2 is None or score1 is None or score2 is None:
        return JsonResponse({'missing fields': 'Data isnt format as expected'}, status=450)

    def add_tournament_game_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 3)
        base_gas = contract.functions.addTournamentGame(instanceIndex, gameType, player1, player2, score1, score2).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 5)
        max_priority_fee_per_gas = web3.to_wei(200, 'gwei')  # 0.005 ETH in Gwei
        max_fee_per_gas = base_gas_price + max_priority_fee_per_gas

        # Build the transaction
        tx = contract.functions.addTournamentGame(instanceIndex, gameType, player1, player2, score1, score2).build_transaction({
            'chainId': 17000,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,  # Fixed tip of 0.005 ETH
            'maxFeePerGas': max_fee_per_gas,
            'gas': gas,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    while True:
        pending_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'pending')
        latest_nonce = web3.eth.get_transaction_count(web3.eth.default_account, 'latest')
        if pending_nonce == latest_nonce:
            break
        time.sleep(5)
        
    try:
        tx_hash = add_tournament_game_func()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'success': 'Tournament game added'}, status=200)

### GETTER FUNCTIONS ###

# Get all the games from an instance (for the history)
@api_view(['GET'])
def get_games(request, instanceIndex, gameType):
    try:
        games = contract.functions.getGames(instanceIndex, gameType).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': games}, status=200)

# Get the current tournament players list
@api_view(['GET'])
def get_tournament_status(request, instanceIndex, gameType):
    try:
        players = contract.functions.getTournamentStatus(instanceIndex, gameType).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': players}, status=200)

# Get the current tournament players list
@api_view(['GET'])
def get_current_tournament_players_list(request, instanceIndex, gameType):
    try:
        players = contract.functions.getCurrentTournamentPlayersList(instanceIndex, gameType).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': players}, status=200)

# Get the next tournament game to play (returns 2 players)
@api_view(['GET'])
def get_next_tournament_player(request, instanceIndex, gameType):
    try:
        players = contract.functions.getNextTournamentPlayers(instanceIndex, gameType).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': players}, status=200)

# Get the last tournament ranking
@api_view(['GET'])
def get_last_tournament_ranking(request, instanceIndex, gameType):
    try:
        ranking = contract.functions.getLastTournamentRanking(instanceIndex, gameType).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': ranking}, status=200)

# Get all the tournaments rankings
@api_view(['GET'])
def get_all_tournaments_rankings(request, instanceIndex, gameType):
    try:
        rankings = contract.functions.getAllTournamentsRankings(instanceIndex, gameType).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': rankings}, status=200)