import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/categories/featured - Get featured categories
export async function GET(request: NextRequest) {
  try {
    const featuredQuery = query(
      collection(db, 'categories'),
      where('featured', '==', true),
      limit(6)
    );
    
    const snapshot = await getDocs(featuredQuery);
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching featured categories:', error);
    return NextResponse.json({ error: 'Failed to fetch featured categories' }, { status: 500 });
  }
}
