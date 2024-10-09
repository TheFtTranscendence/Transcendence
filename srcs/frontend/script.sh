#!/bin/bash


cd /usr/share/nginx/html/

echo "Updating IP"
echo "window.IP = \"$IP\"" >> globals.js

exec nginx -g "daemon off;"