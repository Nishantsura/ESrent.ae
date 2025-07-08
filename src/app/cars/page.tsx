'use client'

import { useEffect, useState } from 'react'
import { Car } from '@/types/car'
import { firebaseCarService } from '@/services/firebaseService'
import { Header } from '../home/components/Header'
import { FilterModal, FilterValues } from '../home/components/FilterModal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { SearchBar } from '../home/components/SearchBar'
import { useCarHire } from '@/contexts/CarHireContext'
import { Calendar } from 'lucide-react'
import { FaWhatsapp } from "react-icons/fa";
import { CarCard } from '@/components/car/CarCard'
import { format, addDays } from 'date-fns';

const ITEMS_PER_PAGE = 12

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [selectedFilters, setSelectedFilters] = useState<FilterValues>({
    types: [],
    tags: [],
    transmission: '',
    maxPrice: 10000,
  })
  const [shouldResetFilters, setShouldResetFilters] = useState(false)
  
  // Get car hire details from context
  const { pickupDate, dropoffDate, pickupLocation, setPickupDate, setDropoffDate } = useCarHire()

  const durations = [
    { label: 'Daily', value: 'daily', days: 1 },
    { label: '+3 Days', value: '3days', days: 3 },
    { label: 'Weekly', value: 'weekly', days: 7 },
  ];
  const [selectedDuration, setSelectedDuration] = useState('daily');

  // Update dropoffDate when pickupDate or duration changes
  useEffect(() => {
    const durationObj = durations.find(d => d.value === selectedDuration) || durations[0];
    const newDropoff = format(addDays(new Date(pickupDate), durationObj.days), 'yyyy-MM-dd');
    setDropoffDate(newDropoff);
  }, [pickupDate, selectedDuration]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  useEffect(() => {
    const loadCars = async () => {
      try {
        const allCars = await firebaseCarService.getAllCars()
        setCars(allCars)
        setFilteredCars(allCars)
      } catch (error) {
        console.error('Error loading cars:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCars()
  }, [])

  const handleFiltersChange = (filters: FilterValues) => {
    setShouldResetFilters(false)
    setSelectedFilters(filters)
    setCurrentPage(1) // Reset to first page when filters change

    const filtered = cars.filter(car => {
      const matchesPrice = car.dailyPrice >= 1000 && car.dailyPrice <= filters.maxPrice
      const matchesTransmission = !filters.transmission || 
                               car.transmission.toLowerCase() === filters.transmission.toLowerCase()
      const matchesCategory = filters.types.length === 0 || 
                       (car.category && filters.types.includes(car.category.toLowerCase()))

      return matchesPrice && matchesTransmission && matchesCategory
    })

    setFilteredCars(filtered)
  }

  const clearFilters = () => {
    setShouldResetFilters(true)
    setSelectedFilters({
      types: [],
      tags: [],
      transmission: '',
      maxPrice: 10000,
    })
    setFilteredCars(cars)
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedCars = filteredCars.slice(startIndex, endIndex)

  const hasActiveFilters = selectedFilters.types.length > 0 || 
    selectedFilters.tags.length > 0 || 
    selectedFilters.transmission !== '' || 
    selectedFilters.maxPrice < 10000

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen justify-center align-center max-w-7xl mx-auto">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full p-4">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen  max-w-7xl mx-auto w-full">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <SearchBar />
        {/* Range Picker UI like home screen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4 w-full max-w-2xl">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">From</label>
            <div className="relative">
              <input
                type="date"
                value={pickupDate}
                onChange={e => setPickupDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 bg-black/50 border border-white/10 rounded-lg text-white appearance-none"
              />
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={20} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-white text-sm font-medium">Duration</label>
            <div className="flex gap-2">
              {durations.map((duration) => (
                <button
                  key={duration.value}
                  onClick={() => setSelectedDuration(duration.value)}
                  className={`flex-1 px-4 py-3 rounded-lg transition-colors ${
                    selectedDuration === duration.value
                      ? 'bg-primary text-black'
                      : 'bg-black/50 text-white border border-white/10 hover:bg-black/70'
                  }`}
                >
                  {duration.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Display selected dates */}
        {pickupDate && dropoffDate && (
          <div className="bg-secondary/50 rounded-lg p-4 my-4 flex items-center gap-4">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Selected dates for car hire in {pickupLocation}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(pickupDate)} - {formatDate(dropoffDate)}
              </p>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="heading-4 font-semibold">All Cars</h1>
          <div className="flex items-center gap-4">
            <FilterModal 
              onFiltersChange={handleFiltersChange} 
              shouldReset={shouldResetFilters} 
            />
          </div>
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {selectedFilters.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            ))}
            {selectedFilters.transmission && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {selectedFilters.transmission.charAt(0).toUpperCase() + selectedFilters.transmission.slice(1)}
              </span>
            )}
            {selectedFilters.maxPrice < 10000 && (
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Up to ${selectedFilters.maxPrice.toLocaleString()}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-primary"
            >
              Clear All
            </Button>
          </div>
        )}

        {/* Cars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
