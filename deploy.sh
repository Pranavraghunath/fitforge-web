#!/bin/bash
# Auto-deploy script for FitForge Web
echo "🚀 Deploying to Vercel..."
cd /home/pranavraghunath/.gemini/antigravity/scratch/fitforge-web
npx vercel --prod --yes
echo "✅ Deployment complete!"
echo "🌐 Visit: https://fitforge-web-seven.vercel.app"
