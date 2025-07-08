import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/brands - Get all brands
export async function GET(request: NextRequest) {
  try {
    const brandsQuery = query(collection(db, 'brands'), orderBy('name'));
    const snapshot = await getDocs(brandsQuery);
    const brands = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(brands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ error: 'Failed to fetch brands' }, { status: 500 });
  }
}

// POST /api/brands - Create new brand
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    // Generate slug if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const brandData = {
      ...body,
      slug,
      featured: body.featured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'brands'), brandData);
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...brandData 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating brand:', error);
    return NextResponse.json({ error: 'Failed to create brand' }, { status: 500 });
  }
} 