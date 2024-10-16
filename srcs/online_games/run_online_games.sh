#!/bin/bash

python manage.py makemigrations > /dev/null 2>&1
python manage.py makemigrations base > /dev/null 2>&1
python manage.py makemigrations invites > /dev/null 2>&1
python manage.py makemigrations queues > /dev/null 2>&1
python manage.py makemigrations remote_games > /dev/null 2>&1
python manage.py makemigrations tournaments > /dev/null 2>&1
python manage.py migrate

python manage.py runserver 0.0.0.0:8004