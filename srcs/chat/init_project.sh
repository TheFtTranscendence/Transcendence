#!/bin/bash

source .env

python ./manage.py makemigrations > /dev/null 2>&1
python ./manage.py makemigrations chatApp > /dev/null 2>&1
python ./manage.py migrate

python manage.py runserver 0.0.0.0:8002