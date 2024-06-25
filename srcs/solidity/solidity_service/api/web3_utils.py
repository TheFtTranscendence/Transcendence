import json
import asyncio
from web3 import Web3, AsyncHTTPProvider
from django.conf import settings

# Get from settings
ethereum_node_url = settings.ETHEREUM_NODE_URL
contract_address = settings.CONTRACT_ADDRESS
private_key = settings.PRIVATE_KEY

# Initialize Web3
web3 = Web3(AsyncHTTPProvider(ethereum_node_url))

# Load the contract ABI
with open('path/to/Score.json') as f:
    contract_abi = json.load(f)['abi']
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

async def get_number_of_games(instance_index):
    return await contract.functions.getNumberOfGames(instance_index).call()

async def add_game(instance_index, player1, player2, score1, score2):
    tx = contract.functions.addGame(instance_index, player1, player2, score1, score2).buildTransaction({
        'chainId': 11155111,
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei'),
        'nonce': await web3.eth.getTransactionCount(web3.eth.default_account),
    })
    signed_tx = web3.eth.account.sign_transaction(tx, private_key)
    tx_hash = await web3.eth.sendRawTransaction(signed_tx.rawTransaction)
    return tx_hash.hex()
