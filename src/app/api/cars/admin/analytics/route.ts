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
  } catch (error: any) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
