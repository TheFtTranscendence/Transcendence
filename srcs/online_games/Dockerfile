FROM python:3.9-slim

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		postgresql-client \
	&& rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY run_online_games.sh .

COPY . .

RUN chmod +x run_online_games.sh

EXPOSE 8004

CMD ["./run_online_games.sh"]