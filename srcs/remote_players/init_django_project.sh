#!/bin/bash

python manage.py makemigrations > /dev/null 2>&1
python manage.py makemigrations remote_access > /dev/null 2>&1
python manage.py migrate

python manage.py runserver 0.0.0.0:8004