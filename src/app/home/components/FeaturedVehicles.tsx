import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Car } from '@/types/car';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilterModal, FilterValues } from './FilterModal';
import { FaWhatsapp } from "react-icons/fa";
import { CarCard } from '@/components/car/CarCard';
import { motion } from "framer-motion";

interface FeaturedVehiclesProps {
  cars: Car[];
}

export function FeaturedVehicles({ cars }: FeaturedVehiclesProps) {
  const initialFilters: FilterValues = {
    types: [] as string[],
    tags: [] as string[],
    transmission: '',
    maxPrice: 10000,
  };

  const [filteredCars, setFilteredCars] = useState<Car[]>(cars);
  const [selectedFilters, setSelectedFilters] = useState(initialFilters);
  const [shouldResetFilters, setShouldResetFilters] = useState(false);

  const handleFiltersChange = (filters: FilterValues) => {
    setShouldResetFilters(false);
    setSelectedFilters(filters);
    const filtered = cars.filter(car => {
      const matchesPrice = car.dailyPrice >= 1000 && car.dailyPrice <= filters.maxPrice;
      const matchesTransmission = !filters.transmission || 
                                 car.transmission.toLowerCase() === filters.transmission.toLowerCase();
      const matchesType = filters.types.length === 0 || 
                         filters.types.includes((car.category || '').toLowerCase());
      const matchesTags = filters.tags.length === 0 ||
                         (car.features || []).some((tag: string) => filters.tags.includes(tag.toLowerCase()));

      return matchesPrice && matchesTransmission && matchesType && matchesTags;
    });

    setFilteredCars(filtered);
  };

  const clearFilters = () => {
    setShouldResetFilters(true);
    setSelectedFilters(initialFilters);
    setFilteredCars(cars);
  };

  const hasActiveFilters = selectedFilters.types.length > 0 || 
    selectedFilters.tags.length > 0 || 
    selectedFilters.transmission !== '' || 
    selectedFilters.maxPrice < 10000;

  return (
    <motion.section
      className="mt-8 px-4 sm:px-6 pb-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-heading-3">Featured Vehicles</h2>
        <div className="flex items-center gap-4">
          <FilterModal onFiltersChange={handleFiltersChange} shouldReset={shouldResetFilters} />
          <Link href="/cars" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-background text-white hover:bg-gray-100 hover:text-white/80 h-10 px-4 py-2">
            View All
          </Link>
        </div>
      </div>
      
      {/* Selected Filters Display */}
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
          {selectedFilters.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1)}
            </span>
          ))}
          {selectedFilters.transmission && (
            <span
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {selectedFilters.transmission.charAt(0).toUpperCase() + selectedFilters.transmission.slice(1)}
            </span>
          )}
          {selectedFilters.maxPrice < 10000 && (
            <span
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.slice(0, 6).map((car) => (
          <CarCard 
            key={car.id} 
            car={car} 
            onClick={() => localStorage.setItem('previousPage', 'home')}
          />
        ))}
      </div>
    </motion.section>
  );
}
