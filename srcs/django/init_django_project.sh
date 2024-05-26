#!/bin/bash

# Check if manage.py exists
if [ ! -f "manage.py" ]; then
    # Initialize Django project
    django-admin startproject myproject .
fi

# update the settings.py file to add postgresql as the database
sed -i "s/'ENGINE': 'django.db.backends.sqlite3',/'ENGINE': 'django.db.backends.postgresql',/" myproject/settings.py
sed -i "s/'NAME': BASE_DIR \/ 'db.sqlite3',/'NAME': 'your_database_name',/" myproject/settings.py
# Use a to append a line after a match
sed -i "/'NAME': 'your_database_name',/a \        'USER': 'your_username'," myproject/settings.py
sed -i "/'USER': 'your_username',/a \        'PASSWORD': 'your_password'," myproject/settings.py
sed -i "/'PASSWORD': 'your_password',/a \        'HOST': 'db'," myproject/settings.py
sed -i "/'HOST': 'db',/a \        'PORT': '5432'," myproject/settings.py


# sed -i "s/'NAME': BASE_DIR \/ 'db.sqlite3',/'NAME': os.environ.get('POSTGRES_DB'),/" myproject/settings.py
# # Use a to append a line after a match
# sed -i "/'NAME': os.environ.get('POSTGRES_DB'),/a \        'USER': os.environ.get('POSTGRES_USER')," myproject/settings.py
# sed -i "/'USER': os.environ.get('POSTGRES_USER'),/a \        'PASSWORD': os.environ.get('POSTGRES_PASSWORD')," myproject/settings.py
# sed -i "/'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),/a \        'HOST': os.environ.get('POSTGRES_HOST')," myproject/settings.py
# sed -i "/'HOST': os.environ.get('POSTGRES_HOST'),/a \        'PORT': os.environ.get('POSTGRES_PORT')," myproject/settings.py

# Run Django development server
python manage.py runserver 0.0.0.0:8000
