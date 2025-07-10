'use client'

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaWhatsapp } from "react-icons/fa";
import { Car } from '@/types/car';
import { Tilt } from '@/components/ui/tilt';
import { Spotlight } from '@/components/ui/spotlight';

interface CarCardProps {
  car: Car;
  onClick?: () => void;
  className?: string;
  linkHref?: string;
}

export function CarCard({ car, onClick, className = '', linkHref }: CarCardProps) {
  const href = linkHref || `/car/${car.id}`;

  // Safely get the first image or use a fallback
  const carImage = car.images && car.images.length > 0 ? car.images[0] : '/images/luxury-car-bg.jpg';
  
  // Safely construct car name
  const carName = car.name || `${car.brand || 'Unknown'} ${car.model || 'Model'}`;
  
  // Safely get car details with fallbacks
  const carYear = car.year || 'N/A';
  const carTransmission = car.transmission || 'N/A';
  const carFuel = car.fuel || 'N/A';
  const carMileage = car.mileage || 0;
  const carPrice = car.dailyPrice || 0;

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = `Hi, I'm interested in renting the ${carName}`;
    window.open(`https://wa.me/971553553626?text=${encodeURIComponent(message)}`, '_blank');
  };

  const cardContent = (
    <CardContent className="p-0">
      <div className="relative overflow-hidden rounded-xl bg-black">
        <div className="aspect-[16/9] w-full h-[320px]">
          <Image
            src={carImage}
            alt={carName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback to a default image if the car image fails to load
              const target = e.target as HTMLImageElement;
              target.src = '/images/luxury-car-bg.jpg';
            }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <div className="absolute bottom-0 w-full p-5 space-y-3">
            <h3 className="text-heading-3 text-white">{carName}</h3>
            <div className="flex items-center gap-2 text-sm text-white/70">
              <span>{carYear}</span>
              <span>•</span>
              <span>{carTransmission}</span>
              <span>•</span>
              <span>{carFuel}</span>
              <span>•</span>
              <span>{carMileage}kms/day</span>
            </div>
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-primary text-heading-3">AED {carPrice.toLocaleString()}</span>
                <span className="text-white/60 text-sm">/day</span>
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full transition-colors"
              >
                <FaWhatsapp size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );

  return (
    <Tilt
      rotationFactor={8}
      isRevese
      springOptions={{
        stiffness: 26.7,
        damping: 4.1,
        mass: 0.2,
      }}
      className="group relative"
    >
      <Spotlight
        className="z-10 from-primary/50 via-primary/20 to-transparent blur-2xl"
        size={248}
        springOptions={{
          stiffness: 26.7,
          damping: 4.1,
          mass: 0.2,
        }}
      />
      {onClick ? (
        <Link href={href} onClick={onClick} className="block">
          {cardContent}
        </Link>
      ) : (
        <Link href={href} className="block">
          {cardContent}
        </Link>
      )}
    </Tilt>
  );
}
