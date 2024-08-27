FROM python:3.9-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt .
COPY init_project.sh .
COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN chmod +x init_project.sh

EXPOSE 8002

CMD ["./init_project.sh"]