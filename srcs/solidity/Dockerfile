# Use a more recent Python base image
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy scripts and requirements
COPY requirements.txt .
COPY solidity_service/ myproject/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["python", "myproject/manage.py", "runserver", "0.0.0.0:8000"]