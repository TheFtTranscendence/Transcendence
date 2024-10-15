#!/bin/bash

curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64" && \
chmod +x mkcert-v*-linux-amd64 && \
cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

mkcert $IP
cp $IP* /etc/nginx/ssl

sed -i "s/\$IP/$IP/g" "/etc/nginx/conf.d/default.conf"

cd /usr/share/nginx/html/

echo "Updating IP"
echo "window.IP = \"$IP\"" >> globals.js

exec nginx -g "daemon off;"