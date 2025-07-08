import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/brands/slug/[slug] - Get brand by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const brandQuery = query(
      collection(db, 'brands'),
      where('slug', '==', decodeURIComponent(slug)),
      limit(1)
    );
    
    const snapshot = await getDocs(brandQuery);
    
    if (snapshot.empty) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const brand = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch brand' }, { status: 500 });
  }
} 