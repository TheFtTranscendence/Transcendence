#!/bin/bash

# Source the .env file to make environment variables available
# source .env


# sed -i "s/'ENGINE': 'django.db.backends.sqlite3',/'ENGINE': 'django.db.backends.postgresql',/" authProject/authProject/settings.py
# sed -i "s/'NAME': BASE_DIR \/ 'db.sqlite3',/'NAME': '${POSTGRES_DB}',/" authProject/authProject/settings.py

# sed -i "/'NAME': '${POSTGRES_DB}',/a \        'USER': '${POSTGRES_USER}'," authProject/authProject/settings.py
# sed -i "/'USER': '${POSTGRES_USER}',/a \        'PASSWORD': '${POSTGRES_PASSWORD}'," authProject/authProject/settings.py
# sed -i "/'PASSWORD': '${POSTGRES_PASSWORD}',/a \        'HOST': '${POSTGRES_HOST}'," authProject/authProject/settings.py
# sed -i "/'HOST': '${POSTGRES_HOST}',/a \        'PORT': ${POSTGRES_PORT}," authProject/authProject/settings.py

python userManagementProject/manage.py runserver 0.0.0.0:8000
