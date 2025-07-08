import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/cars/[id] - Get car by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const carDoc = await getDoc(doc(db, 'cars', id));
    
    if (!carDoc.exists()) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: carDoc.id,
      ...carDoc.data()
    });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

// PUT /api/cars/[id] - Update car
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    // Remove id from body if present
    const { id, ...updateData } = body;
    
    // Add updatedAt timestamp
    const carData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await updateDoc(doc(db, 'cars', id), carData);
    
    return NextResponse.json({
      id: id,
      ...carData
    });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

// DELETE /api/cars/[id] - Delete car
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteDoc(doc(db, 'cars', id));
    
    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
} 