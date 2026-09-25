FROM php:8.4-cli-alpine
RUN apk add --no-cache git unzip sqlite-dev oniguruma-dev $PHPIZE_DEPS \
    && docker-php-ext-install pdo_sqlite mbstring pcntl bcmath \
    && apk del $PHPIZE_DEPS
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /app
USER 1000:1000
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
