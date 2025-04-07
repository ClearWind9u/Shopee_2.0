FROM php:8.1-apache

# Cài đặt các thư viện cần thiết cho MySQL và các extension
RUN apt-get update && apt-get install -y libpng-dev libjpeg-dev libfreetype6-dev \
    && docker-php-ext-install pdo pdo_mysql mysqli

# Copy mã nguồn vào thư mục web của Apache
COPY . /var/www/html/

# Cung cấp cổng mà Railway cung cấp thông qua biến môi trường
ENV PORT 80

# Mở cổng ứng dụng (cổng mặc định cho Railway)
EXPOSE $PORT