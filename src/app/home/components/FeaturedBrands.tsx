'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Brand } from '@/types/brand';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { motion } from "framer-motion";

interface FeaturedBrandsProps {
  brands: Brand[];
}

export function FeaturedBrands({ brands }: FeaturedBrandsProps) {
  // Filter out brands with missing data and duplicate brands for seamless looping
  const validBrands = brands.filter(brand => 
    brand && 
    brand.name && 
    brand.logo && 
    brand.slug
  );
  
  const loopBrands = [...validBrands, ...validBrands];

  // Don't render if no valid brands
  if (validBrands.length === 0) {
    return null;
  }

  return (
    <motion.section
      className="mt-4 sm:mt-10"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-heading text-heading-3">Featured Brands</h2>
          <Link href="/brands" className="text-white hover:text-white/80">
            View all
          </Link>
        </div>
        <div className="overflow-x-hidden group">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={28}
            slidesPerView="auto"
            loop={true}
            freeMode={true}
            speed={15000}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            allowTouchMove={true}
            className="!overflow-visible"
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
              1280: { slidesPerView: 7 },
            }}
          >
            {loopBrands.map((brand, index) => (
              <SwiperSlide key={`${brand.id}-${index}`} className="!w-auto">
                <Link
                  href={`/brand/${encodeURIComponent(brand.slug)}`}
                  className="relative w-40 h-32 aspect-[5/4] shrink-0 bg-black rounded-2xl flex flex-col items-center justify-center transition-colors duration-300 shadow-sm border border-border overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:border-primary"
                  style={{ minWidth: 128, minHeight: 96 }}
                >
                  <div className="w-12 h-12 relative transition-transform duration-300 hover:scale-110">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback to a default brand image if the logo fails to load
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/ES logo (1).svg';
                      }}
                    />
                  </div>
                  <span className="body-2 font-medium text-center whitespace-nowrap mt-2 text-white transition-colors hover:text-primary">
                    {brand.name}
                  </span>
                  <div className="absolute inset-0 pointer-events-none transition-all duration-300 hover:bg-primary/10 rounded-2xl" />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </motion.section>
  );
}
