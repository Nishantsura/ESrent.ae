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
import { searchAPI } from '@/services/api'
import { Header } from '@/app/home/components/Header'
import { SearchBar } from '@/app/home/components/SearchBar'

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
        // Use our new search API instead of Algolia
        const searchResults = await searchAPI.search(query);
        console.log('Search results:', searchResults); // Debug log

        // The results already come from Firebase, so we can use them directly
        setResults(searchResults);
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
                      {car.transmission && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{car.transmission}</span>
                        </div>
                      )}
                      {car.fuel && (
                        <div className="flex items-center gap-1">
                          <Fuel className="h-4 w-4" />
                          <span>{car.fuel}</span>
                        </div>
                      )}
                      {car.brand && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{car.brand}</span>
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
