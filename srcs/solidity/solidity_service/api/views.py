from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse

import json
from web3 import Web3, HTTPProvider
from django.conf import settings
import time

import logging

logger = logging.getLogger(__name__)

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
    # print("Loaded JSON content:", contract_abi_list)  # Debugging line
    
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
        gas = int(base_gas * 3)
        max_priority_fee_per_gas = web3.to_wei(100, 'gwei')  # 0.005 ETH in Gwei
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
def add_game(request, instanceIndex, gameName):
    data = request.data
    players = data.get('players')  # Expecting a list with two players
    scores = data.get('scores')    # Expecting a list with two scores

    if players is None or len(players) != 2 or scores is None or len(scores) != 2:
        return JsonResponse({'missing fields': 'Data isn’t formatted as expected'}, status=450)

    def add_game_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 2)
        
        base_gas = contract.functions.addGame(instanceIndex, gameName, players, scores).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 3)
        max_priority_fee_per_gas = web3.to_wei(100, 'gwei')  # 0.005 ETH in Gwei
        max_fee_per_gas = base_gas_price + max_priority_fee_per_gas

        # Build the transaction
        tx = contract.functions.addGame(instanceIndex, gameName, players, scores).build_transaction({
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
        logger.exception(e)
        return JsonResponse({'exception': str(e)}, status=400)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    return JsonResponse({'success': 'Game added'}, status=200)

# Add tournament (4 or 8 players)
@api_view(['POST'])
def add_tournament(request, instanceIndex, gameName):
    data = request.data
    players = data.get('players')  # Expecting a list of players
    tournamentId = data.get('tournamentId')  # Expecting a tournament ID
    games = data.get('games')  # Expecting a list of games

    # Validate input
    if players is None or len(players) not in [4, 8]:
        return JsonResponse({'missing fields': 'Players list is missing or does not contain 4 or 8 players'}, status=450)

    if tournamentId is None:
        return JsonResponse({'missing fields': 'Tournament ID is missing'}, status=450)

    if games is None:
        return JsonResponse({'missing fields': 'Games data is missing'}, status=450)

    def add_tournament_func():
        # Estimate gas and gas price
        base_gas_price = web3.eth.gas_price
        gas_price = int(base_gas_price * 2)

        # Estimate the gas required for the contract function call
        base_gas = contract.functions.addTournament(instanceIndex, gameName, tournamentId, players, games).estimate_gas({
            'from': web3.eth.default_account
        })
        gas = int(base_gas * 3)
        max_priority_fee_per_gas = web3.to_wei(100, 'gwei')  # 0.005 ETH in Gwei
        max_fee_per_gas = base_gas_price + max_priority_fee_per_gas

        # Build the transaction
        tx = contract.functions.addTournament(instanceIndex, gameName, tournamentId, players, games).build_transaction({
            'chainId': 17000,
            'maxPriorityFeePerGas': max_priority_fee_per_gas,  # Fixed tip of 0.005 ETH
            'maxFeePerGas': max_fee_per_gas,
            'gas': gas,
            'nonce': web3.eth.get_transaction_count(web3.eth.default_account),
        })
        signed_tx = web3.eth.account.sign_transaction(tx, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return tx_hash

    # Check for pending transactions to avoid nonce conflicts
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

# Get the pongy games
@api_view(['GET'])
def get_pongy_games(request, instanceIndex):
    try:
        games = contract.functions.getPongyGames(instanceIndex).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': games}, status=200)

# Get the fighty games
@api_view(['GET'])
def get_fighty_games(request, instanceIndex):
    try:
        games = contract.functions.getFightyGames(instanceIndex).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': games}, status=200)

# Get the pongy tournaments
@api_view(['GET'])
def get_pongy_tournaments(request, instanceIndex):
    try:
        tournaments = contract.functions.getPongyTournaments(instanceIndex).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': tournaments}, status=200)

# Get the fighty tournaments
@api_view(['GET'])
def get_fighty_tournaments(request, instanceIndex):
    try:
        tournaments = contract.functions.getFightyTournaments(instanceIndex).call()
    except Exception as e:
        return JsonResponse({'exception': str(e)}, status=400)

    return JsonResponse({'success': tournaments}, status=200)