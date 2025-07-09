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

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...');
    
    const email = 'admin@esrent.ae';
    const newPassword = 'AutoLuxe2025!'; // New secure password
    
    // Get user by email
    const user = await auth.getUserByEmail(email);
    console.log(`Found user: ${user.email}`);
    
    // Update password
    await auth.updateUser(user.uid, {
      password: newPassword,
      emailVerified: true
    });
    
    console.log(`✅ Password reset successfully for: ${user.email}`);
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 New Password: ${newPassword}`);
    console.log('');
    console.log('🔐 You can now log in at: http://localhost:3000/admin/login');
    
  } catch (error) {
    console.error('❌ Error resetting password:', error);
    process.exit(1);
  }
}

resetAdminPassword(); 