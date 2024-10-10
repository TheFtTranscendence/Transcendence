# Use a more recent Python base image
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy scripts and requirements
COPY requirements.txt .
COPY Score.json .
COPY init_django_project.sh .
COPY solidity_service/ solidity_service/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x init_django_project.sh

# Expose port
EXPOSE 8001

# Command to run the application
# CMD ["python", "myproject/manage.py", "runserver", "0.0.0.0:8001"]
CMD ["./init_django_project.sh"]