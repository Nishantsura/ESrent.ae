# AutoLuxe - Luxury Car Rental Platform

A modern, full-stack luxury car rental platform built with Next.js, Firebase, and TypeScript. Features a beautiful UI, real-time data synchronization, and comprehensive admin dashboard.

## 🚀 Features

- **🏎️ Car Catalog**: Browse luxury vehicles with detailed specifications
- **🔍 Advanced Search**: Filter by brand, type, fuel, and more
- **👨‍💼 Admin Dashboard**: Complete CRUD operations for cars, brands, and categories
- **🔐 Authentication**: Secure Firebase Authentication
- **📱 Responsive Design**: Mobile-first approach with modern UI
- **⚡ Real-time Updates**: Live data synchronization with Firestore
- **🔥 Firebase Integration**: Firestore, Storage, Authentication, and Functions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Firebase (Firestore, Functions, Storage, Auth)
- **Styling**: Tailwind CSS, Framer Motion
- **Search**: Algolia (optional)
- **UI Components**: Radix UI, Lucide React
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase project
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd autoluxe-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

Fill in your Firebase configuration values:
- Get your Firebase config from Firebase Console > Project Settings > General
- For Algolia (optional): Get keys from Algolia Dashboard
- For Firebase Admin: Generate service account key from Firebase Console

### 4. Firebase Setup

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init
```

### 5. Build Functions

```bash
cd functions
npm install
npm run build
cd ..
```

### 6. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (this will be done automatically)

2. **Connect to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables in Vercel project settings

3. **Environment Variables for Vercel**:
   Add all variables from `.env.local` to Vercel:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
   NEXT_PUBLIC_BACKEND_URL (leave empty)
   ```

4. **Deploy Firebase Functions** (if using):
   ```bash
   firebase deploy --only functions
   ```

### Manual Deployment Commands

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
autoluxe-app/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── api/            # API routes
│   │   ├── car/            # Car detail pages
│   │   └── ...
│   ├── components/         # Reusable components
│   │   ├── ui/             # UI components
│   │   ├── car/            # Car-specific components
│   │   └── admin/          # Admin components
│   ├── lib/                # Utility libraries
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── hooks/              # Custom React hooks
├── functions/              # Firebase Functions
├── public/                 # Static assets
└── scripts/                # Utility scripts
```

## 🔑 Key Features

### Admin Dashboard
- **Car Management**: Add, edit, delete cars with image uploads
- **Brand Management**: Manage car brands and logos
- **Category Management**: Organize cars by types and categories
- **Analytics**: View rental statistics and insights

### User Experience
- **Car Browsing**: Filter and search through luxury vehicles
- **Detailed Views**: Comprehensive car specifications and galleries
- **Responsive Design**: Optimized for all devices
- **Fast Performance**: Optimized with Next.js and modern web practices

## 🔒 Authentication

The app uses Firebase Authentication with:
- Email/password authentication for admins
- Secure route protection
- Role-based access control

## 📊 Database Schema

### Cars Collection
```typescript
{
  id: string;
  name: string;
  brand: string;
  type: string;
  year: number;
  price: number;
  images: string[];
  specifications: object;
  location: string;
  available: boolean;
  // ... more fields
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run sync-algolia` - Sync data with Algolia

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Configuration**: Ensure all environment variables are set correctly
2. **Build Errors**: Check TypeScript errors and dependencies
3. **Function Deployment**: Verify Firebase CLI is installed and authenticated

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
