# Transcendence

## Summmary

Transendence is the final project of the 42 Common Core and compromizes of the following aspects:

- single page application with a pong-game, tournaments, authentication and chats
- must be launched with a single command using Docker
- Frontend with vanilla Javascrpit (for now)
- Backend with Django
- Database with PostgreSQL
- Blockchain storing tournament scores, written with Solidity on the Ethereum Blockchain

## Contributors
This is group project of a project of:

- [ddantas42](https://github.com/ddantas42)
- [lopjf](https://github.com/lopjf)
- [esali](https://github.com/emSali)
- [courinha](https://github.com/Courinha768)
- [tiago](https://github.com/tpereira22)

.env setup
- POSTGRES_DATA_PATH: A directory where the volume of the database will be stored and persist. (create a directory on your machine and add its path to this variable).
- POSTGRES_DB: The database name (anything will work)
- POSTGRES_USER: Your username (anything will work)
- POSTGRES_PASSWORD: Your password (anything will work)
- POSTGRES_HOST: The database docker service name. It should match the service name in docker-compose.yml. In our case it is 'db'.
- POSTGRES_PORT: Default postgres port is 5432. It needs to be set to 5432.
- PRIVATE_KEY: The owner wallet private key.

Commands:

- 'make' to start the containers.
- 'make clean' to stop and remove the images and containers.
- 'make deepclean' to delete all docker related containers, images, network from your system.
