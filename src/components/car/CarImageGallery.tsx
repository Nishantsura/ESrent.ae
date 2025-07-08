'use client'

import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { cn } from '@/lib/utils'

interface CarImageGalleryProps {
  images: string[]
  carName: string
  currentImageIndex: number
  setCurrentImageIndex: (index: number) => void
  isLightboxOpen: boolean
  setIsLightboxOpen: (open: boolean) => void
  handleTouchStart: (e: React.TouchEvent) => void
  handleTouchMove: (e: React.TouchEvent) => void
  handleTouchEnd: () => void
}

export function CarImageGallery({
  images,
  carName,
  currentImageIndex,
  setCurrentImageIndex,
  isLightboxOpen,
  setIsLightboxOpen,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd
}: CarImageGalleryProps) {
  return (
    <div className="lg:flex-1 md:mr-2 mx-4 md:mx-0 mt-4 md:mt-0">
      <div 
        className="relative h-72 md:h-[70vh] group rounded-2xl overflow-hidden shadow-md"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentImageIndex]}
          alt={`${carName} - Image ${currentImageIndex + 1}`}
          fill
          className="object-cover cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        />
        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === currentImageIndex ? "bg-white" : "bg-white/50"
              )}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex(index);
              }}
            />
          ))}
        </div>
      </div>

      <Dialog.Root open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/90 z-50" />
          <Dialog.Content 
            className="fixed inset-0 z-50 flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Dialog.Title asChild>
              <VisuallyHidden>
                {carName} - Image {currentImageIndex + 1} of {images.length}
              </VisuallyHidden>
            </Dialog.Title>
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={images[currentImageIndex]}
                alt={`${carName} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
              <button
                className="absolute top-4 right-4 text-white p-2 rounded-full bg-black/50"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    onClick={() => setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
                    onClick={() => setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    )}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
