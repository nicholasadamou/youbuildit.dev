#!/bin/bash

# Deploy migrations to production database
# This script applies pending migrations to the production database

echo "🚀 Deploying database migrations..."

# Check if DATABASE_URL is set
if [ -z "$PRISMA_DATABASE_URL" ]; then
    echo "❌ Error: PRISMA_DATABASE_URL environment variable is not set"
    echo "Please set your production database URL"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🗄️ Deploying database migrations..."
npx prisma migrate deploy

echo "📊 Checking database status..."
npx prisma migrate status

echo "✅ Database migrations deployed successfully!"
echo ""
echo "🔍 You can verify the migration was successful by:"
echo "1. Checking your database has the User table"
echo "2. Visiting https://youbuildit.dev/api/debug/subscription-status"
echo "3. The error message should disappear from the account page"