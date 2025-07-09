import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
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

// PUT /api/brands/[id] - Update brand
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
    return createAuthError('Authentication required to update brands');
  }
  
  try {
    const body = await request.json();
    
    // Remove id from body if present (avoid variable name conflict)
    const { id: bodyId, ...updateData } = body;
    
    // Add updatedAt timestamp
    const brandData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    await adminDb.collection('brands').doc(id).update(brandData);
    
    return NextResponse.json({
      id: id,
      ...brandData
    });
  } catch (error) {
    console.error('Error updating brand:', error);
    return NextResponse.json({ error: 'Failed to update brand' }, { status: 500 });
  }
}

// DELETE /api/brands/[id] - Delete brand
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
    return createAuthError('Authentication required to delete brands');
  }
  
  try {
    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    // First, get the brand to check its name
    const brandDocRef = adminDb.collection('brands').doc(id);
    const brandSnapshot = await brandDocRef.get();
    
    if (!brandSnapshot.exists) {
      return NextResponse.json({ 
        error: 'Brand not found.' 
      }, { status: 404 });
    }
    
    const brandData = brandSnapshot.data();
    const brandName = brandData?.name;
    
    if (!brandName) {
      return NextResponse.json({ 
        error: 'Brand name not found.' 
      }, { status: 400 });
    }
    
    // Check if there are any cars with this brand name
    const carsSnapshot = await adminDb.collection('cars')
      .where('brand', '==', brandName)
      .get();
    
    if (!carsSnapshot.empty) {
      return NextResponse.json({ 
        error: `Cannot delete brand "${brandName}". There are ${carsSnapshot.size} cars associated with this brand. Please delete or reassign these cars first.` 
      }, { status: 400 });
    }
    
    // If no cars are associated, proceed with deletion
    await brandDocRef.delete();
    
    return NextResponse.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('Error deleting brand:', error);
    if (error instanceof Error) {
      if (error.message.includes('permission-denied')) {
        return NextResponse.json({ 
          error: 'Permission denied. Please ensure you have admin access and try again.' 
        }, { status: 403 });
      }
      if (error.message.includes('not-found')) {
        return NextResponse.json({ 
          error: 'Brand not found.' 
        }, { status: 404 });
      }
    }
    return NextResponse.json({ error: 'Failed to delete brand' }, { status: 500 });
  }
} 