# Use the official nginx image as the base image
FROM nginx:latest

# Copy the static files to the nginx html directory
COPY public /usr/share/nginx/html

COPY script.sh / 
RUN chmod +x script.sh

# Expose port 80 to the host
EXPOSE 80

# Start nginx
CMD ["./script.sh"]