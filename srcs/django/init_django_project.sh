#!/bin/bash

# Check if manage.py exists
if [ ! -f "manage.py" ]; then
    # Initialize Django project
    django-admin startproject myproject .
fi

# Run Django development server
python manage.py runserver 0.0.0.0:8000
