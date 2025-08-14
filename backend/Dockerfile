# ---------- Stage 1: Build dependencies ----------
FROM php:8.2-cli AS vendor

# Set Composer memory limit
ENV COMPOSER_MEMORY_LIMIT=-1

WORKDIR /app

# Install system dependencies separately to reduce memory spikes
RUN apt-get update && \
    apt-get install -y unzip git libzip-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy composer files first (for caching)
COPY composer.json composer.lock ./

RUN composer install --no-interaction --prefer-dist --optimize-autoloader --no-scripts

# Then copy the rest of the code
COPY . .

# Run the scripts manually after code is copied
RUN php artisan package:discover --ansi

# Remove public/storage symlink if exists
RUN rm -rf public/storage

# ---------- Stage 2: Final runtime image ----------
FROM php:8.2-apache AS production

WORKDIR /var/www/html

# Install only runtime dependencies
RUN apt-get update && \
    apt-get install -y libpq-dev unzip libzip-dev && \
    docker-php-ext-install pdo pdo_pgsql zip && \
    a2enmod rewrite && \
    rm -rf /var/lib/apt/lists/*

# Copy application and vendor from build stage
COPY --from=vendor /app /var/www/html

# Set permissions for Laravel
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Recreate storage symlink inside container
RUN php artisan storage:link || true

# Expose Laravel HTTP and WebSocket ports
EXPOSE 8000
EXPOSE 6001

# Run Laravel HTTP server and WebSockets in parallel
CMD ["sh", "-c", "php artisan migrate --path=database/migrations/admin && php artisan serve --host=0.0.0.0 --port=8000 & php artisan websockets:serve && php artisan db:seed"]
