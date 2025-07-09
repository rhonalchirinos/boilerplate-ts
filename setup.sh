#!/bin/sh

echo "🚀 Setting up project..."

if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create a .env file with your configuration"
    exit 1
fi

echo "📦 Installing dependencies..."
docker compose run -T --rm api corepack yarn install

echo "🔧 Installing Husky hooks..."
yarn husky init

echo "✅ Setup completed successfully!"
echo "You can now start developing!"