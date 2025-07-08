import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/categories/type/[type] - Get categories by type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  try {
    const typeQuery = query(
      collection(db, 'categories'),
      where('type', '==', decodeURIComponent(type))
    );
    
    const snapshot = await getDocs(typeQuery);
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories by type:', error);
    return NextResponse.json({ error: 'Failed to fetch categories by type' }, { status: 500 });
  }
} 