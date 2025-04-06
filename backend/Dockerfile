FROM php:8.1-apache

# Copy toàn bộ project vào container
COPY . /var/www/html/

# Cài extension MySQLi để kết nối DB
RUN docker-php-ext-install mysqli

# Mở cổng 80 (Apache)
EXPOSE 80
