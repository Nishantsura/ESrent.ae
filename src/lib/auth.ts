import { NextRequest } from 'next/server';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin if not already initialized
const getFirebaseAdmin = () => {
  if (getApps().length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error('Missing Firebase Admin credentials');
    }

    return initializeApp({
      credential: cert(serviceAccount),
    });
  }
  return getApp();
};

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  email_verified?: boolean;
}

export async function verifyAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('No bearer token provided');
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const app = getFirebaseAdmin();
    const auth = getAuth(app);
    const decodedToken = await auth.verifyIdToken(token);
    
    // Optional: Check if user email is from authorized domain
    // if (!decodedToken.email?.endsWith('@autoluxe.com')) {
    //   throw new Error('Not an authorized email domain');
    // }
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      email_verified: decodedToken.email_verified,
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    throw new Error('Authentication failed');
  }
}

export function createAuthError(message: string = 'Authentication required') {
  return new Response(
    JSON.stringify({ error: message }),
    { status: 401, headers: { 'Content-Type': 'application/json' } }
  );
} 