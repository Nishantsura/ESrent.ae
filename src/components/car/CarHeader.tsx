'use client'

import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CarBrandLogo } from './CarBrandLogo'
import { useCarHire } from '@/contexts/CarHireContext'

interface CarHeaderProps {
  previousPage: string
  selectedDate: string
  endDate: string
  title: string
  brand: string
  setSelectedDate: (date: string) => void
  setEndDate: (date: string) => void
}

export function CarHeader({
  previousPage,
  selectedDate,
  endDate,
  title,
  brand,
  setSelectedDate,
  setEndDate
}: CarHeaderProps) {
  // Get pickup location from context
  const { pickupLocation } = useCarHire()
  
  // Use the location from context or default to Dubai
  const location = pickupLocation || 'Dubai'
  
  return (
    <div className="sticky top-0 z-20 white/90 backdrop-blur-2xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-12 px-4 pt-2 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link href={previousPage === 'search' ? '/search' : '/'} className="mr-4">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        
        </div>
        {/* <CarBrandLogo brand={brand} /> */}
        <div className="flex">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="text-sm font-medium">{location}</span>
          </div>
        </div>
      </div>
      <div className="px-4 py-2 flex flex-row gap-4">
        <label 
          htmlFor="pickup-date"
          className="relative px-4 py-3 flex-1 flex items-center justify-between border-none rounded-xl bg-black/80 shadow-md cursor-pointer hover:bg-secondary/30 transition-colors duration-200 h-12 md:h-16"
          onClick={(e) => {
            if (window.matchMedia('(hover: hover)').matches) {
              e.preventDefault();
              const dateInput = document.getElementById('pickup-date') as HTMLInputElement;
              if (dateInput) {
                dateInput.showPicker();
              }
            }
          }}
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-white/70">Pickup Date</span>
              <span className="text-sm font-medium text-white">
                {selectedDate ? new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                }) : 'Select date'}
              </span>
            </div>
          </div>
          <input
            type="date"
            id="pickup-date"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full touch-manipulation bg-black text-white"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            min={new Date().toISOString().split('T')[0]}
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              if (e.target.value && (!endDate || new Date(endDate) <= new Date(e.target.value))) {
                setEndDate(e.target.value);
              }
            }}
            aria-label="Pickup date"
          />
        </label>

        <label 
          htmlFor="end-date"
          className="relative px-4 py-3 flex-1 flex items-center justify-between border-none rounded-xl bg-black/80 shadow-md cursor-pointer hover:bg-secondary/30 transition-colors duration-200 h-12 md:h-16"
          onClick={(e) => {
            if (window.matchMedia('(hover: hover)').matches) {
              e.preventDefault();
              const dateInput = document.getElementById('end-date') as HTMLInputElement;
              if (dateInput) {
                dateInput.showPicker();
              }
            }
          }}
        >
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <div className="flex flex-col">
              <span className="text-xs text-white/70">Return Date</span>
              <span className="text-sm font-medium text-white">
                {endDate ? new Date(endDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                }) : 'Select date'}
              </span>
            </div>
          </div>
          <input
            type="date"
            id="end-date"
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full touch-manipulation bg-black text-white"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            min={selectedDate || new Date().toISOString().split('T')[0]}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            aria-label="Return date"
          />
        </label>
      </div>
    </div>
  )
}
