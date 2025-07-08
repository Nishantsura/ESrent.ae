import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/brands/featured - Get featured brands
export async function GET(request: NextRequest) {
  try {
    const featuredQuery = query(
      collection(db, 'brands'),
      where('featured', '==', true),
      limit(8)
    );
    
    const snapshot = await getDocs(featuredQuery);
    const brands = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching featured brands:', error);
    return NextResponse.json({ error: 'Failed to fetch featured brands' }, { status: 500 });
  }
} 