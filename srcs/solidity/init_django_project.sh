#!/bin/bash

# Source the .env file to make environment variables available
# source .env

# Debugging: Print environment variables
# echo "ETHEREUM_NODE_URL=${ETHEREUM_NODE_URL}"
# echo "CONTRACT_ADDRESS=${CONTRACT_ADDRESS}"
# echo "PRIVATE_KEY=${PRIVATE_KEY}"

# sed -i "s/ethereum_node_url = GET_ETHEREUM_NODE_URL/ethereum_node_url = ${ETHEREUM_NODE_URL}/" solidity_service/solidity_service/settings.py
# sed -i "s/contract_address = GET_CONTRACT_ADDRESS/contract_address = ${CONTRACT_ADDRESS}/" solidity_service/solidity_service/settings.py
# sed -i "s/private_key = GET_PRIVATE_KEY/private_key = ${PRIVATE_KEY}/" solidity_service/solidity_service/settings.py

python solidity_service/manage.py makemigrations > /dev/null 2>&1
python solidity_service/manage.py makemigrations api > /dev/null 2>&1
python solidity_service/manage.py migrate

python solidity_service/manage.py runserver 0.0.0.0:8001
