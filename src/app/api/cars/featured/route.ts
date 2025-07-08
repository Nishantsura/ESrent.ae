import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/cars/featured - Get featured cars
export async function GET(request: NextRequest) {
  try {
    const featuredQuery = query(
      collection(db, 'cars'),
      where('featured', '==', true),
      limit(6)
    );
    
    const snapshot = await getDocs(featuredQuery);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    return NextResponse.json({ error: 'Failed to fetch featured cars' }, { status: 500 });
  }
} 