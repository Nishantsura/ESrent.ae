'use client'

import { Suspense, useEffect, useState, Component, ReactNode } from "react"
import { Car } from "@/types/car"
import { Brand } from "@/types/brand"
import { Category } from "@/types/category"
import { firebaseCarService, firebaseBrandService, firebaseCategoryService } from "@/services/firebaseService"
import { Header } from "./components/Header"
import { SearchBar } from "./components/SearchBar"

import { FeaturedBrands } from "./components/FeaturedBrands"
import { Categories } from "./components/Categories"
import { FeaturedVehicles } from "./components/FeaturedVehicles"
import { CardSkeleton, CategoryCardSkeleton } from '@/components/ui/card-skeleton';
import { Skeleton } from '@/components/ui/skeleton';
import TestimonialsSection from "./components/TestimonialsSection";
import { FaWhatsapp } from "react-icons/fa";
import { NotSureSection } from "./components/NotSureSection";
import { HeroSection } from "./components/HeroSection";
import DemoOne from '@/components/ui/demo';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-4">
          <p className="heading-4 text-red-500">Something went wrong:</p>
          <pre className="body-2">{this.state.error?.message}</pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function LoadingSpinner() {
  return (
    <div className="grid gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
      <CategoryCardSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Custom cache implementation
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  // Only use cache in browser
  if (typeof window === 'undefined') {
    return fetcher();
  }

  const cached = cache.get(key) as CacheEntry<T> | undefined;
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: now });
  return data;
}

function FeaturedContent() {
  const [data, setData] = useState<{
    cars: Car[];
    brands: Brand[];
    categories: Category[];
  }>({
    cars: [],
    brands: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [partialError, setPartialError] = useState<string | null>(null);
  const [configError, setConfigError] = useState<boolean>(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check Firebase configuration first
        if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
          setConfigError(true);
          setLoading(false);
          return;
        }

        // Load data with individual error handling
        const results = await Promise.allSettled([
          fetchWithCache('featuredCars', firebaseCarService.getFeaturedCars),
          fetchWithCache('featuredBrands', firebaseBrandService.getFeaturedBrands),
          fetchWithCache('featuredCategories', firebaseCategoryService.getFeaturedCategories),
        ]);

        const cars = results[0].status === 'fulfilled' ? results[0].value : [];
        const brands = results[1].status === 'fulfilled' ? results[1].value : [];
        const categories = results[2].status === 'fulfilled' ? results[2].value : [];

        // Check for any failures
        const failures = results.filter(result => result.status === 'rejected');
        if (failures.length > 0) {
          console.warn('Some data failed to load:', failures);
          setPartialError(`${failures.length} data source(s) failed to load, but showing available content.`);
        }

        // Filter out any invalid data
        const validCars = cars.filter(car => car && car.id && car.name);
        const validBrands = brands.filter(brand => brand && brand.id && brand.name && brand.logo);
        const validCategories = categories.filter(category => category && category.name);

        setData({ 
          cars: validCars, 
          brands: validBrands, 
          categories: validCategories 
        });
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err : new Error('Failed to load data'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (configError) {
    return (
      <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-2xl font-bold text-red-600 mb-4">Firebase Configuration Required</h3>
        <p className="text-red-700 mb-4">
          The Firebase environment variables are not configured. Please set up your Firebase configuration:
        </p>
        <div className="text-left bg-red-100 p-4 rounded-md mb-4 text-sm">
          <p className="font-semibold mb-2">Create a <code>.env.local</code> file in your project root with:</p>
          <pre className="text-xs whitespace-pre-wrap">
{`NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id`}
          </pre>
        </div>
        <p className="text-red-700">
          Get these values from your Firebase Console → Project Settings → General → Your apps
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="heading-4 text-red-500">Something went wrong:</p>
        <pre className="body-2">{error.message}</pre>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {partialError && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">{partialError}</p>
        </div>
      )}
      <FeaturedBrands brands={data.brands} />
      <FeaturedVehicles cars={data.cars} />
      <DemoOne />
      <Categories categories={data.categories} />
      <TestimonialsSection />
    </>
  );
}

function WhatsAppFAB() {
      const whatsappNumber = "+971553553626"; // Replace with your actual WhatsApp number
  const message = "Hi, I'm interested in renting a car"; // Default message
  
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-12 right-12 sm:right-12 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 ease-in-out z-50"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
    </button>
  );
}

export default function HomeScreen() {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <div className="relative z-0">
        <HeroSection />
        <main className="flex-1 max-w-7xl mx-auto w-full p-4">
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <FeaturedContent />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
      <WhatsAppFAB />
    </div>
  );
}
