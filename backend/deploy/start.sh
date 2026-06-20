#!/bin/sh
set -e

PORT=${PORT:-8080}

# Inject the correct PORT into nginx config
sed "s/__PORT__/$PORT/" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Run migrations
php artisan migrate --force

# Cache config/routes for performance
php artisan config:cache
php artisan route:cache

exec /usr/bin/supervisord -c /etc/supervisord.conf
