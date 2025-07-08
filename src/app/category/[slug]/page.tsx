'use client';

import { Metadata } from 'next';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car } from '@/types/car';
import { firebaseCarService } from '@/services/firebaseService';
import { SearchResultsSkeleton } from '@/components/ui/card-skeleton';
import { PageHeader } from '@/components/PageHeader';
import { ErrorState } from '@/components/ui/error-state';
import { FaWhatsapp } from "react-icons/fa";
import { CarCard } from '@/components/car/CarCard';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarsByType();
  }, [slug]);

  const loadCarsByType = async () => {
    try {
      setLoading(true);
      const decodedType = decodeURIComponent(slug);
      const allCars = await firebaseCarService.getAllCars();
      const carsData = allCars.filter(car => car.category && car.category.toLowerCase() === decodedType.toLowerCase());
      setCars(carsData);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader title="Loading..." />
        <div className="container mx-auto px-4 py-8">
          <SearchResultsSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader title={decodeURIComponent(slug).toUpperCase()} />
      <div className="container mx-auto px-4 py-8">
        {cars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
              />
            ))}
          </div>
        ) : (
          <ErrorState 
            title="No Cars Found"
            message={`We couldn't find any cars of type '${decodeURIComponent(slug)}'. Please try another type or return to home.`}
            showHomeButton={true}
          />
        )}
      </div>
    </div>
  );
}
