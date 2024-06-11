FROM python:3.9-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt .
COPY init_django_project.sh .
COPY authProject/ authProject/

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x init_django_project.sh

EXPOSE 8001

CMD ["./init_django_project.sh"]