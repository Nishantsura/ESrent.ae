import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, hasValidConfig } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase is properly configured
    if (!hasValidConfig || !db) {
      return NextResponse.json(
        { error: 'Firebase not properly configured' },
        { status: 500 }
      );
    }

    const brandsRef = collection(db, 'brands');
    const featuredQuery = query(brandsRef, where('featured', '==', true));
    const querySnapshot = await getDocs(featuredQuery);
    
    const brands = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured brands' },
      { status: 500 }
    );
  }
} 