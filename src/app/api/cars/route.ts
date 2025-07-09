import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, query, where, orderBy, limit } from 'firebase/firestore';
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

// GET /api/cars - Get all cars with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brand = searchParams.get('brand');
    const transmission = searchParams.get('transmission');
    const type = searchParams.get('type');
    const fuel = searchParams.get('fuel');
    const available = searchParams.get('available');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const constraints = [];

    // Add filters if provided
    if (brand) constraints.push(where('brand', '==', brand));
    if (transmission) constraints.push(where('transmission', '==', transmission));
    if (type) constraints.push(where('category', '==', type));
    if (fuel) constraints.push(where('fuel', '==', fuel));
    if (available !== null) constraints.push(where('isAvailable', '==', available === 'true'));

    const carsQuery = constraints.length > 0 
      ? query(collection(db, 'cars'), ...constraints)
      : collection(db, 'cars');

    const snapshot = await getDocs(carsQuery);
    let cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Apply price filters (client-side since Firestore doesn't support range queries with other filters)
    if (minPrice) {
      cars = cars.filter(car => car.dailyPrice >= Number(minPrice));
    }
    if (maxPrice) {
      cars = cars.filter(car => car.dailyPrice <= Number(maxPrice));
    }

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

// POST /api/cars - Create new car
export async function POST(request: NextRequest) {
  // Verify authentication
  try {
    await verifyAuth(request);
  } catch (error) {
    console.error('Authentication failed:', error);
    return createAuthError('Authentication required to create cars');
  }
  
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'brand', 'model', 'year', 'transmission', 'fuel', 'dailyPrice'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    // Set default values
    const carData = {
      ...body,
      isAvailable: body.isAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
      mileage: body.mileage ?? 0,
      features: body.features ?? [],
      images: body.images ?? [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Use Firebase Admin SDK for server-side operations
    const app = getFirebaseAdmin();
    const adminDb = getFirestore(app);
    
    const docRef = await adminDb.collection('cars').add(carData);
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...carData 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
} 