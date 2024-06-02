#!/bin/bash

# Source the .env file to make environment variables available
source .env

# Wait for the PostgreSQL database to be ready
# ./wait-for-it.sh ${POSTGRES_HOST}:${POSTGRES_PORT} --timeout=30 --strict -- echo "Database is up"

# Check if manage.py exists
# if [ ! -f "manage.py" ]; then
#     # Initialize Django project
#     django-admin startproject myproject .
# fi

# update the settings.py file to add postgresql as the database
sed -i "s/'ENGINE': 'django.db.backends.sqlite3',/'ENGINE': 'django.db.backends.postgresql',/" myproject/backend/settings.py
sed -i "s/'NAME': BASE_DIR \/ 'db.sqlite3',/'NAME': '${POSTGRES_DB}',/" myproject/backend/settings.py
# Use a to append a line after a match
sed -i "/'NAME': '${POSTGRES_DB}',/a \        'USER': '${POSTGRES_USER}'," myproject/backend/settings.py
sed -i "/'USER': '${POSTGRES_USER}',/a \        'PASSWORD': '${POSTGRES_PASSWORD}'," myproject/backend/settings.py
sed -i "/'PASSWORD': '${POSTGRES_PASSWORD}',/a \        'HOST': '${POSTGRES_HOST}'," myproject/backend/settings.py
sed -i "/'HOST': '${POSTGRES_HOST}',/a \        'PORT': ${POSTGRES_PORT}," myproject/backend/settings.py

# add installed apps
# sed -i "/'django.contrib.staticfiles',/a \    'rest_framework'," myproject/settings.py

# Run Django development server
python myproject/manage.py runserver 0.0.0.0:8000
