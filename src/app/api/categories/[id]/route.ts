import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase';
import { verifyAuth, createAuthError } from '@/lib/auth';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';

// Get Firebase Admin instance
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

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Verify authentication
  try {
    await verifyAuth(request);
  } catch (error) {
    console.error('Authentication failed:', error);
    return createAuthError('Authentication required to update categories');
  }
  
  try {
    const body = await request.json();
    
    // Remove id from body if present (avoid variable name conflict)
    const { id: bodyId, ...updateData } = body;
    
    // Add updatedAt timestamp
    const categoryData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    await adminDb.collection('categories').doc(id).update(categoryData);
    
    return NextResponse.json({
      id: id,
      ...categoryData
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  // Verify authentication
  try {
    await verifyAuth(request);
  } catch (error) {
    console.error('Authentication failed:', error);
    return createAuthError('Authentication required to delete categories');
  }
  
  try {
    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    await adminDb.collection('categories').doc(id).delete();
    
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
} 