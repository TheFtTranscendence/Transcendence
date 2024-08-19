#!/bin/bash

source .env

export PYTHONPATH=./userManagementProject

python userManagementProject/manage.py makemigrations > /dev/null 2>&1
python userManagementProject/manage.py makemigrations authentication > /dev/null 2>&1
python userManagementProject/manage.py migrate

create_superuser() {
    python -c "
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'userManagementProject.userManagementAPP.settings')
import django
django.setup()

from django.contrib.auth import get_user_model;
from django.db.utils import IntegrityError;
User = get_user_model();
try:
    if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
        User.objects.create_superuser(username='$DJANGO_SUPERUSER_USERNAME', email='$DJANGO_SUPERUSER_EMAIL', password='$DJANGO_SUPERUSER_PASSWORD')
        print('Superuser created successfully.')
except IntegrityError as e:
    print(f'Error creating superuser: {e}')
    "
}

create_superuser

python userManagementProject/manage.py runserver 0.0.0.0:8000