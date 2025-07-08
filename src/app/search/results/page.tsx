'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, Star, Users, Fuel } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SearchResultsSkeleton } from '@/components/ui/card-skeleton';
import { Car } from '@/types/car'
import { carsIndex } from '@/lib/algolia'
import { Header } from '@/app/home/components/Header'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { SearchBar } from '@/app/home/components/SearchBar'

// Define the Algolia hit type that extends the base hit type with our Car properties
interface AlgoliaHit extends Omit<Car, 'id'> {
  objectID: string;
  _highlightResult?: Record<string, any>;
  _snippetResult?: Record<string, any>;
  _rankingInfo?: Record<string, any>;
  _distinctSeqID?: number;
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-transparent ">
      <Header />
      <SearchBar />
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResults />
      </Suspense>
    </div>
  )
}

function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<Car[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchCars = async () => {
      if (!query.trim()) {
        setResults([])
        setIsLoading(false)
        return
      }

      try {
        const { hits } = await carsIndex.search<AlgoliaHit>(query, {
          // Remove restriction to search across all attributes
        })
        console.log('Search hits:', hits); // Debug log

        // Fetch additional data from Firestore for each hit
        const enrichedResults = await Promise.all(
          hits.map(async (hit) => {
            try {
              // Get the full document from Firestore
              const carDoc = await getDoc(doc(db, 'cars', hit.objectID));
              
              if (carDoc.exists()) {
                const firestoreData = carDoc.data();
                // Merge Algolia and Firestore data, preferring Firestore data
                return {
                  id: hit.objectID,
                  ...hit,
                  ...firestoreData,
                  // Ensure critical fields are properly typed
                  seats: Number(firestoreData.seats || hit.seats) || 0,
                  year: Number(firestoreData.year || hit.year) || 0,
                  rating: Number(firestoreData.rating || hit.rating) || 0,
                  dailyPrice: Number(firestoreData.dailyPrice || hit.dailyPrice) || 0,
                  advancePayment: Boolean(firestoreData.advancePayment ?? hit.advancePayment),
                  rareCar: Boolean(firestoreData.rareCar ?? hit.rareCar),
                  featured: Boolean(firestoreData.featured ?? hit.featured),
                  available: Boolean(firestoreData.available ?? hit.available),
                  images: Array.isArray(firestoreData.images) ? firestoreData.images : (Array.isArray(hit.images) ? hit.images : []),
                  tags: Array.isArray(firestoreData.tags) ? firestoreData.tags : (Array.isArray(hit.tags) ? hit.tags : []),
                } as Car;
              }
            } catch (error) {
              console.error(`Error fetching Firestore data for car ${hit.objectID}:`, error);
            }
            
            // Fallback to Algolia data if Firestore fetch fails
            return {
              id: hit.objectID,
              name: hit.name || '',
              brand: hit.brand || '',
              transmission: hit.transmission || 'automatic',
              seats: Number(hit.seats) || 0,
              year: Number(hit.year) || 0,
              rating: Number(hit.rating) || 0,
              advancePayment: Boolean(hit.advancePayment),
              rareCar: Boolean(hit.rareCar),
              featured: Boolean(hit.featured),
              fuelType: hit.fuelType || 'petrol',
              engineCapacity: hit.engineCapacity || '',
              power: hit.power || '',
              dailyPrice: typeof hit.dailyPrice === 'number' ? hit.dailyPrice : 0,
              type: hit.type || 'sedan',
              tags: Array.isArray(hit.tags) ? hit.tags : [],
              description: hit.description || '',
              images: Array.isArray(hit.images) ? hit.images : [],
              available: Boolean(hit.available),
              location: hit.location || { name: 'Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } }
            } as Car;
          })
        );

        setResults(enrichedResults);
      } catch (error) {
        console.error('Error searching cars:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    searchCars()
  }, [query])

  if (isLoading) {
    return <SearchResultsSkeleton />
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-lg font-medium">
          {results.length > 0 ? (
            <>Search Results for "{query}"</>
          ) : (
            <>No Results Found for "{query}"</>
          )}
        </h1>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((car) => {
            return (
              <Link key={car.id} href={`/car/${car.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    {car.images?.[0] && (
                      <Image
                        src={car.images[0]}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{car.name}</h2>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      {car.year && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>{car.year}</span>
                        </div>
                      )}
                      {car.seats && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{car.seats} seats</span>
                        </div>
                      )}
                      {car.fuelType && (
                        <div className="flex items-center gap-1">
                          <Fuel className="h-4 w-4" />
                          <span>{car.fuelType}</span>
                        </div>
                      )}
                      {car.location && typeof car.location === 'object' && 'name' in car.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{car.location.name}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <p className="text-xl font-semibold">
                        AED {typeof car.dailyPrice === 'number' ? car.dailyPrice.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        }) : '0.00'}/day
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No cars found matching your search criteria.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      )}
    </div>
  )
}
