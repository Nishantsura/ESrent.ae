import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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

// GET /api/cars/[id] - Get car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const carDoc = await getDoc(doc(db, 'cars', id));
    
    if (!carDoc.exists()) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: carDoc.id,
      ...carDoc.data()
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

// PUT /api/cars/[id] - Update car
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
    return createAuthError('Authentication required to update cars');
  }
  
  try {
    const body = await request.json();
    
    // Remove id from body if present (avoid variable name conflict)
    const { id: bodyId, ...updateData } = body;
    
    // Add updatedAt timestamp
    const carData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    await adminDb.collection('cars').doc(id).update(carData);
    
    return NextResponse.json({
      id: id,
      ...carData
    });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// DELETE /api/cars/[id] - Delete car
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
    return createAuthError('Authentication required to delete cars');
  }
  
  try {
    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    await adminDb.collection('cars').doc(id).delete();
    
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
} 