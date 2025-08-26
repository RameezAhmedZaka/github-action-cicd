# Use official Nginx image
FROM nginx:alpine

# Set working directory to default Nginx html folder
WORKDIR /usr/share/nginx/html

# Remove default Nginx static files
RUN rm -rf ./*

# Copy your HTML, CSS, JS into the container
COPY dataapp/ .

# Expose port 80
EXPOSE 80

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]




