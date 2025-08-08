#!/bin/bash
# Kill any running Next.js dev servers
pkill -f "next dev" 2>/dev/null

# Clear the .next cache
rm -rf .next

# Start the dev server fresh
npm run dev
