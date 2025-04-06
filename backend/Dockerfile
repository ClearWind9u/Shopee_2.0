FROM php:8.1-apache

# Copy toàn bộ project vào container
COPY . /var/www/html/

# Cài extension MySQLi để kết nối DB (nếu sử dụng MySQLi)
RUN docker-php-ext-install mysqli

# Cài extension PDO MySQL để kết nối DB (nếu sử dụng PDO)
RUN docker-php-ext-install pdo pdo_mysql

# Mở cổng 80 (Apache)
EXPOSE 80