# Use a more recent Python base image
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy script and requirements
COPY requirements.txt .
COPY init_django_project.sh .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# chmod the script
RUN chmod +x init_django_project.sh

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["./init_django_project.sh"]
