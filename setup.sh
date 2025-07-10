#!/bin/bash

echo "🚀 AutoLuxe Frontend Setup Script"
echo "=================================="

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "❌ .env.local already exists. Remove it first if you want to recreate it."
    exit 1
fi

echo "📝 Creating .env.local file..."

# Create .env.local with basic configuration
cat > .env.local << 'EOF'
# Firebase Client Configuration (for frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAPcBozYWP0udmsKLdKjF9esvWTUkyNWZI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autoluxe-39e0b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=autoluxe-39e0b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=autoluxe-39e0b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=960065879103
NEXT_PUBLIC_FIREBASE_APP_ID=1:960065879103:web:47ef23805cc91f4b7e4c8a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGBP0J8PK8

# Firebase Admin Configuration (for server-side API routes)
# TODO: Replace these with your actual Firebase service account credentials
FIREBASE_PROJECT_ID=autoluxe-39e0b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@autoluxe-39e0b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# API Configuration
API_BASE_URL=local
NODE_ENV=development
EOF

echo "✅ .env.local file created successfully!"
echo ""
echo "🔑 IMPORTANT: You still need to add your Firebase Admin credentials:"
echo ""
echo "1. Go to: https://console.firebase.google.com/project/autoluxe-39e0b"
echo "2. Click Project Settings (gear icon)"
echo "3. Go to Service Accounts tab"
echo "4. Click 'Generate New Private Key'"
echo "5. Download the JSON file"
echo "6. Replace these values in .env.local:"
echo "   - FIREBASE_CLIENT_EMAIL (from 'client_email' in JSON)"
echo "   - FIREBASE_PRIVATE_KEY (from 'private_key' in JSON, keep quotes and \\n)"
echo ""
echo "🚀 Once you've added the credentials, run:"
echo "   npm run dev"
echo ""
echo "📋 For Vercel deployment, see SETUP_GUIDE.md"
echo ""
echo "✨ Setup complete! Check SETUP_GUIDE.md for detailed instructions." 