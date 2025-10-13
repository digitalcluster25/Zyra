#!/bin/sh
set -e

# Replace $PORT in nginx config with actual PORT value
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /tmp/nginx.conf
mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g 'daemon off;'
