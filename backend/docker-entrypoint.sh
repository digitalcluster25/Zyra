#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npm run migrate

echo "🌱 Seeding database..."
npm run seed || echo "⚠️ Seed failed (might be already seeded)"

echo "🚀 Starting server..."
exec npm start

