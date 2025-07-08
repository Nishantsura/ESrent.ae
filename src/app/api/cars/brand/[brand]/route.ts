import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/cars/brand/[brand] - Get cars by brand
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brand: string }> }
) {
  const { brand } = await params;
  try {
    const brandQuery = query(
      collection(db, 'cars'),
      where('brand', '==', decodeURIComponent(brand))
    );
    
    const snapshot = await getDocs(brandQuery);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars by brand:', error);
    return NextResponse.json({ error: 'Failed to fetch cars by brand' }, { status: 500 });
  }
} 