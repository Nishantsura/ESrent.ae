import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error('Missing Firebase Admin credentials');
  }

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const auth = getAuth();

async function createAdminUser() {
  try {
    console.log('👤 Creating admin user...');
    
    const email = 'admin@esrent.ae';
    const password = 'Admin123!'; // Change this to a secure password
    
    // Check if user already exists
    try {
      const existingUser = await auth.getUserByEmail(email);
      console.log(`✅ Admin user already exists: ${existingUser.email}`);
      return;
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }
    
    // Create the admin user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      emailVerified: true,
      displayName: 'Admin User'
    });
    
    console.log(`✅ Admin user created successfully: ${userRecord.email}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('');
    console.log('🔐 You can now log in at: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser(); 