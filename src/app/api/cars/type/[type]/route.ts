import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/cars/type/[type] - Get cars by type/category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { type } = await params;
  try {
    const typeQuery = query(
      collection(db, 'cars'),
      where('category', '==', decodeURIComponent(type))
    );
    
    const snapshot = await getDocs(typeQuery);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars by type:', error);
    return NextResponse.json({ error: 'Failed to fetch cars by type' }, { status: 500 });
  }
} 