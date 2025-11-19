#!/bin/bash
# Set environment variables in Vercel
# Make sure you have Vercel CLI installed: npm i -g vercel

vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add DATABASE_URL production
vercel env add NEXT_PUBLIC_API_URL production

echo "Environment variables added! Now redeploy your project."
