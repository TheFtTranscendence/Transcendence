include srcs/.env

# '-f' specify the file to use. 'up' start the containers. '-d' detached mode. '--build' build the images before starting the containers.
all:
	@docker compose -f ./srcs/docker-compose.yml up --build

# 'down' stop and remove the containers.
down:
	@docker compose -f ./srcs/docker-compose.yml down

re:
	@docker compose -f srcs/docker-compose.yml up --build

# 'ps' list the containers. 'images' list the images.
status :
	@docker ps
	@docker images

# 'stop' stop the containers. 'rm' remove the containers. 'rmi' remove the images. 'volume rm' remove the volumes. 'network rm' remove the networks and keeps the defaults bridge|host|none.
clean:
	@docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);\
	for network in $$(docker network ls --format "{{.Name}}" | grep -vE '^(bridge|host|none)'); do \
    	docker network rm $$network; \
    done

deepclean:
	rm -rf $(POSTGRES_DATA_PATH)/*
	make clean
	yes | docker system prune

.PHONY: all down status clean