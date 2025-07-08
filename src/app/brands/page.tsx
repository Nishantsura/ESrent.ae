'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Brand } from '@/types/brand';
import { brandAPI } from '@/services/api';
import { BrandDetailsSkeleton } from '@/components/ui/card-skeleton';
import { PageHeader } from '@/components/PageHeader';

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await brandAPI.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <PageHeader title="All Brands" />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <BrandDetailsSkeleton key={index} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title="All Brands" />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand: Brand) => (
            <Link
              key={brand.id}
              href={`/brand/${encodeURIComponent(brand.slug)}`}
              className="p-4 bg-card rounded-xl flex flex-col items-center justify-center hover:bg-accent transition-colors shadow-lg border border-border text-foreground"
            >
              <div className="w-16 h-16 relative mb-2">
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-sm font-medium text-center text-foreground">{brand.name}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
