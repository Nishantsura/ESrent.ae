import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, addDoc, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const categoriesQuery = query(collection(db, 'categories'), orderBy('name'));
    const snapshot = await getDocs(categoriesQuery);
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }

    // Generate slug if not provided
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const categoryData = {
      ...body,
      slug,
      featured: body.featured ?? false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'categories'), categoryData);
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...categoryData 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
} 