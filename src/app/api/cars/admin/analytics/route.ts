import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // No need for external backend URL - using Firebase directly
    console.log('Fetching analytics from Firebase...'); // Debug log

    const token = request.headers.get('authorization');
    console.log('Received token:', token ? 'Present' : 'Missing'); // Debug log

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token' },
        { status: 401 }
      );
    }

    if (!db) {
      throw new Error('Firebase not configured');
    }

    // Get counts from Firebase collections
    const [carsSnapshot, brandsSnapshot, categoriesSnapshot] = await Promise.all([
      getDocs(collection(db, 'cars')),
      getDocs(collection(db, 'brands')),
      getDocs(collection(db, 'categories'))
    ]);

    const analytics = {
      totalCars: carsSnapshot.size,
      totalBrands: brandsSnapshot.size,
      totalCategories: categoriesSnapshot.size,
      // Calculate additional stats
      availableCars: carsSnapshot.docs.filter(doc => doc.data().isAvailable).length,
      featuredCars: carsSnapshot.docs.filter(doc => doc.data().isFeatured).length,
    };

    console.log('Analytics result:', analytics); // Debug log

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' && error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
