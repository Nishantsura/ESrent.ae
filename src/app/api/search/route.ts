import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// GET /api/search - Search cars without Algolia
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Get all cars from Firebase
    const snapshot = await getDocs(collection(db, 'cars'));
    const allCars = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Filter cars based on search query
    const searchResults = allCars.filter(car => {
      const searchableText = [
        car.name || '',
        car.brand || '',
        car.model || '',
        car.category || '',
        car.fuel || '',
        car.transmission || '',
        ...(car.features || [])
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });

    // Sort by relevance (exact matches first, then partial matches)
    searchResults.sort((a, b) => {
      const aName = (a.name || '').toLowerCase();
      const bName = (b.name || '').toLowerCase();
      
      // Exact name matches first
      if (aName === query && bName !== query) return -1;
      if (bName === query && aName !== query) return 1;
      
      // Name starts with query
      if (aName.startsWith(query) && !bName.startsWith(query)) return -1;
      if (bName.startsWith(query) && !aName.startsWith(query)) return 1;
      
      // Brand matches
      const aBrand = (a.brand || '').toLowerCase();
      const bBrand = (b.brand || '').toLowerCase();
      if (aBrand === query && bBrand !== query) return -1;
      if (bBrand === query && aBrand !== query) return 1;
      
      return 0;
    });

    // Limit results to 20
    const limitedResults = searchResults.slice(0, 20);

    return NextResponse.json(limitedResults);
  } catch (error) {
    console.error('Error searching cars:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
} 