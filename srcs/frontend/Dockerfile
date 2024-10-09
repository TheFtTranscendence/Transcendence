# Use the official nginx image as the base image
FROM nginx:latest

RUN apt-get update && apt-get install -y curl gettext

RUN	mkdir -p /etc/nginx/ssl

# Copy the static files to the nginx html directory
COPY public /usr/share/nginx/html

COPY script.sh / 
RUN chmod +x script.sh

COPY nginx.conf /etc/nginx/conf.d/nginx.conf

# Expose port 80 to the host
EXPOSE 80

# Start nginx
CMD ["./script.sh"]