docker build -t my_django_app .

docker run -p 8000:8000 my_django_app

docker ps

docker exec -it <container_id> bash



access http://localhost:8000