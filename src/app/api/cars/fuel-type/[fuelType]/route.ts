import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/cars/fuel-type/[fuelType] - Get cars by fuel type
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fuelType: string }> }
) {
  const { fuelType } = await params;
  try {
    const fuelQuery = query(
      collection(db, 'cars'),
      where('fuel', '==', decodeURIComponent(fuelType))
    );
    
    const snapshot = await getDocs(fuelQuery);
    const cars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error fetching cars by fuel type:', error);
    return NextResponse.json({ error: 'Failed to fetch cars by fuel type' }, { status: 500 });
  }
} 