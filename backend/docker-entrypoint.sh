#!/bin/sh
set -e

echo "🚀 Starting docker-entrypoint.sh..."
echo "📁 Current directory: $(pwd)"
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

echo "🔄 Running database migrations..."
npm run migrate

echo "🌱 Seeding database..."
npm run seed || echo "⚠️ Seed failed (might be already seeded)"

echo "🚀 Starting server..."
echo "🌐 PORT: $PORT"
echo "🌐 NODE_ENV: $NODE_ENV"
exec npm start

