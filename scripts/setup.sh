#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
export LOCAL_UID=${LOCAL_UID:-$(id -u)}
export LOCAL_GID=${LOCAL_GID:-$(id -g)}
if [ ! -f .env ]; then cp .env.example .env; fi
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
docker compose build app
docker compose run --rm app composer install --no-interaction
# Only create missing local secrets. Re-running setup must not invalidate sessions.
docker compose run --rm app php -r '
$p = ".env";
$s = file_get_contents($p);
$s = preg_replace_callback("/^REVERB_APP_SECRET=$/m", fn () => "REVERB_APP_SECRET=".bin2hex(random_bytes(32)), $s);
file_put_contents($p, $s);
'
if ! grep -Eq '^APP_KEY=.+$' .env; then
    docker compose run --rm app php artisan key:generate --no-interaction
fi
if [ ! -f database/database.sqlite ]; then touch database/database.sqlite; fi
docker compose run --rm app php artisan migrate --force
docker compose run --rm node npm ci
docker compose run --rm node npm run build
docker compose up -d --wait app reverb
printf '%s\n' 'Chat Rooms is ready. Open the APP_URL configured in .env.'
printf '%s\n' 'Optional local demo accounts: docker compose run --rm app php artisan db:seed --class=DemoSeeder'
