import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { db } from '@/lib/firebase';
import { verifyAuth, createAuthError } from '@/lib/auth';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';

// Get Firebase Admin instance
const getFirebaseAdmin = () => {
  if (getApps().length === 0) {
    let serviceAccount;

    // Try to get service account from environment variables
    // Option 1: Use complete service account JSON (recommended)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
      try {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      } catch (e) {
        console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
        throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON format');
      }
    }
    // Option 2: Use individual environment variables
    else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      };
    }
    // Option 3: Use the public project ID for limited functionality
    else if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.warn('Using client-side Firebase config for admin operations. Limited functionality.');
      return initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    }
    else {
      throw new Error(
        'Firebase Admin credentials not found. Please set either:\n' +
        '1. FIREBASE_SERVICE_ACCOUNT_JSON (recommended)\n' +
        '2. FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY\n' +
        '3. Or ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set'
      );
    }

    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error('Incomplete Firebase service account credentials');
    }

    return initializeApp({
      credential: cert(serviceAccount),
      projectId: serviceAccount.projectId,
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

    if (!db) {
      return NextResponse.json({ error: 'Firebase not configured' }, { status: 500 });
    }

    const carsQuery = constraints.length > 0 
      ? query(collection(db!, 'cars'), ...constraints)
      : collection(db!, 'cars');

    const snapshot = await getDocs(carsQuery);
    interface CarData {
      id: string;
      dailyPrice: number;
      [key: string]: unknown;
    }
    
    let cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CarData[];

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

    // Set default values and normalize data
    const carData = {
      ...body,
      isAvailable: body.isAvailable ?? true,
      isFeatured: body.isFeatured ?? false,
      featured: body.isFeatured ?? false, // Add for backward compatibility
      available: body.isAvailable ?? true, // Add for backward compatibility
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