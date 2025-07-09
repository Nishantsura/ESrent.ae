# 🚀 AutoLuxe Deployment Guide

This guide covers deploying both the **Frontend (Next.js)** and **Backend (Express.js)** for the AutoLuxe platform.

## 🏗️ Architecture Overview

- **Frontend**: Next.js app (deploys to Vercel)
- **Backend**: Express.js + Firebase Admin SDK (deploys to Render/Railway)
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Authentication**: Firebase Auth

## 📋 Prerequisites

1. **GitHub Account** ✅ (Done)
2. **Firebase Project** ✅ (Done) 
3. **Vercel Account** ✅ (Done)
4. **Render Account** (for backend) - [Sign up here](https://render.com)

## 🔐 Environment Variables Needed

### Firebase Configuration (for both frontend and backend):
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAPcBozYWP0udmsKLdKjF9esvWTUkyNWZI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=autoluxe-39e0b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=autoluxe-39e0b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=autoluxe-39e0b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=960065879103
NEXT_PUBLIC_FIREBASE_APP_ID=1:960065879103:web:47ef23805cc91f4b7e4c8a
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BGBP0J8PK8
```

### Backend-Specific Environment Variables:
```
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...} # Full JSON
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-vercel-app.vercel.app
```

---

## 🚀 Step 1: Deploy Backend to Render

### Option A: Deploy with Render Dashboard

1. **Go to Render**: [https://render.com/dashboard](https://render.com/dashboard)
2. **Connect GitHub**: Link your GitHub account
3. **Create Web Service**: 
   - Repository: `Nishantsura/ESrent.ae`
   - Name: `autoluxe-backend`
   - Environment: `Node`
   - Region: `Oregon (US West)`
   - Branch: `main`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`

4. **Add Environment Variables** in Render:
   ```
   NODE_ENV=production
   PORT=10000
   FIREBASE_SERVICE_ACCOUNT_JSON=<YOUR_FIREBASE_SERVICE_ACCOUNT_JSON>
   FRONTEND_URL=https://esrent-ae.vercel.app
   ```

5. **Deploy**: Click "Create Web Service"

### Option B: Deploy with render.yaml (Automated)

1. The project includes `render.yaml` configuration
2. Push to GitHub and Render will auto-deploy
3. Add environment variables in Render dashboard

---

## 🌐 Step 2: Update Frontend Configuration

### Update Vercel Environment Variables

1. **Go to Vercel**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. **Select Your Project**: ESrent.ae
3. **Settings** → **Environment Variables**
4. **Add Backend URL**:
   ```
   NEXT_PUBLIC_BACKEND_URL=https://your-render-app.onrender.com
   ```
   
5. **Redeploy**: Trigger new deployment

---

## 🔧 Step 3: Get Firebase Service Account

1. **Firebase Console**: [https://console.firebase.google.com](https://console.firebase.google.com)
2. **Project Settings** → **Service Accounts**
3. **Generate New Private Key**
4. **Copy the JSON content** for `FIREBASE_SERVICE_ACCOUNT_JSON`

---

## ✅ Step 4: Verification

### Backend Health Check
- Visit: `https://your-backend-url.onrender.com/api/cars`
- Should return JSON data or proper error message

### Frontend Check  
- Visit: `https://your-frontend-url.vercel.app`
- Admin login should work
- Car catalog should load
- Image uploads should function

---

## 🛠️ Alternative: Railway Deployment

If you prefer Railway over Render:

1. **Sign up**: [https://railway.app](https://railway.app)
2. **Connect GitHub**: Link your repository
3. **Deploy**: Railway will use `railway.toml` configuration
4. **Add Environment Variables** in Railway dashboard
5. **Update Frontend** with Railway URL

---

## 🔒 Security Checklist

- [ ] Firebase service account JSON is secure
- [ ] CORS is properly configured  
- [ ] Environment variables are set correctly
- [ ] No sensitive data in GitHub repository
- [ ] Firebase rules are properly configured

---

## 🐛 Troubleshooting

### Backend Issues
- **Build fails**: Check `cd server && npm install` works locally
- **CORS errors**: Verify `FRONTEND_URL` environment variable
- **Firebase errors**: Check service account JSON is valid

### Frontend Issues
- **API calls fail**: Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- **Authentication fails**: Check Firebase config variables
- **Build fails**: Verify all environment variables are set

---

## 📞 Support

- **Backend URL**: Will be `https://autoluxe-backend.onrender.com`
- **Frontend URL**: `https://esrent-ae.vercel.app`
- **Admin Access**: Use Firebase Authentication

---

## 🎯 Expected URLs

After successful deployment:
- **Frontend**: `https://esrent-ae-[random].vercel.app`
- **Backend**: `https://autoluxe-backend-[random].onrender.com`
- **Admin**: `https://esrent-ae-[random].vercel.app/admin` 