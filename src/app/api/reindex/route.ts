import { NextResponse } from 'next/server'
import { reindexAllCars } from '@/lib/algolia'

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    console.log('Starting reindexing process...')
    
    // Check for required environment variables
    if (!process.env.NEXT_PUBLIC_ALGOLIA_APP_ID) {
      throw new Error('NEXT_PUBLIC_ALGOLIA_APP_ID is not set')
    }
    if (!process.env.ALGOLIA_ADMIN_KEY) {
      throw new Error('ALGOLIA_ADMIN_KEY is not set')
    }

    const result = await reindexAllCars()
    console.log('Reindexing completed:', result)
    
    return NextResponse.json({ 
      message: 'Reindexing completed successfully',
      result 
    })
  } catch (error: unknown) {
    console.error('Detailed error during reindexing:', error)
    return NextResponse.json({ 
      error: 'Reindexing failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
