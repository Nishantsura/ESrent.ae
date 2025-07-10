# 🚀 AutoLuxe Frontend Setup Guide

## Current Status
✅ Firebase configuration available  
✅ API routes fixed to use Admin SDK consistently  
❌ Missing `.env.local` file (needs to be created)  
❌ Missing Firebase Admin credentials (needs Firebase service account)  

## 🔧 Quick Setup (5 minutes)

### Step 1: Create `.env.local` file

Create a `.env.local` file in your project root with this content:

```bash
# Firebase Client Configuration (for frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAPcBozYWP0udmsKLdKjF9esvWTUkyNWZI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autoluxe-39e0b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=autoluxe-39e0b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=autoluxe-39e0b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=960065879103
NEXT_PUBLIC_FIREBASE_APP_ID=1:960065879103:web:47ef23805cc91f4b7e4c8a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGBP0J8PK8

# Firebase Admin Configuration (for server-side API routes)
FIREBASE_PROJECT_ID=autoluxe-39e0b
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@autoluxe-39e0b.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# API Configuration
API_BASE_URL=local
NODE_ENV=development
```

### Step 2: Get Firebase Admin Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/project/autoluxe-39e0b)
2. Click **Project Settings** (gear icon)
3. Go to **Service Accounts** tab
4. Click **Generate New Private Key**
5. Download the JSON file
6. From the JSON file, copy:
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the quotes and \n characters)

### Step 3: Restart Development Server

```bash
npm run dev
```

## 🌐 Vercel Deployment Setup

### Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your AutoLuxe project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```bash
# Client-side Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAPcBozYWP0udmsKLdKjF9esvWTUkyNWZI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autoluxe-39e0b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=autoluxe-39e0b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=autoluxe-39e0b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=960065879103
NEXT_PUBLIC_FIREBASE_APP_ID=1:960065879103:web:47ef23805cc91f4b7e4c8a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGBP0J8PK8

# Server-side Firebase admin (from service account JSON)
FIREBASE_PROJECT_ID=autoluxe-39e0b
FIREBASE_CLIENT_EMAIL=[YOUR_SERVICE_ACCOUNT_EMAIL]
FIREBASE_PRIVATE_KEY=[YOUR_SERVICE_ACCOUNT_PRIVATE_KEY]

# Production settings
NODE_ENV=production
API_BASE_URL=vercel
```

### Redeploy

1. Commit and push your changes
2. Vercel will auto-deploy
3. Or manually trigger deployment in Vercel dashboard

## ✅ Verification Checklist

After setup, verify these work:

- [ ] **Local Development**: `npm run dev` starts without Firebase errors
- [ ] **Admin Access**: `/admin` page loads and can authenticate
- [ ] **Car Management**: Can create/edit cars in admin panel
- [ ] **Public Pages**: Homepage loads with featured cars/brands
- [ ] **Vercel Deployment**: Production site works without errors

## 🐛 Troubleshooting

### "Firebase not properly initialized" errors
- Check all `NEXT_PUBLIC_*` variables are set correctly
- Restart development server after adding env variables

### "Authentication failed" errors  
- Verify `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` are from service account JSON
- Make sure private key includes the full `-----BEGIN PRIVATE KEY-----` format
- Check that service account has proper permissions in Firebase

### "Permission denied" errors
- Verify you're logged in with `@esrent.ae` email domain
- Check Firestore rules allow authenticated writes

### Vercel deployment issues
- Ensure all environment variables are added to Vercel
- Check build logs for missing variables
- Verify no secrets are committed to Git

## 📞 Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Check Vercel function logs for server-side errors  
3. Verify Firebase service account has admin permissions

## 🎯 Expected Result

After successful setup:
- **Local**: `http://localhost:3000` 
- **Admin**: `http://localhost:3000/admin`
- **Production**: `https://your-app.vercel.app`

All features should work including car management, authentication, and data persistence. 