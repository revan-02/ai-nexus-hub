#!/bin/bash
set -e

echo "🚀 Building Next.js Standalone for Hostinger..."
npm run build

echo "📁 Copying static assets and database dump to standalone bundle..."
cp -r public .next/standalone/
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/
cp ai_nexus_db.sql .next/standalone/

echo "📦 Creating deployable zip archive: hostinger-deploy.zip..."
cd .next/standalone
zip -rq ../../hostinger-deploy.zip .
cd ../..

echo "✅ Done! 'hostinger-deploy.zip' is ready for upload to Hostinger."
