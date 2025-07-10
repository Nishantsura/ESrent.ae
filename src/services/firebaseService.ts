import { collection, getDocs, doc, getDoc, query, where, limit, orderBy } from 'firebase/firestore';
import { db, isFirebaseReady } from '@/lib/firebase';
import { Car } from '@/types/car';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';

// Data normalization function to handle inconsistent Firebase data
const normalizeCar = (rawData: any, id: string): Car | null => {
  try {
    // Ensure we have the minimum required data
    if (!rawData || typeof rawData !== 'object') {
      console.warn(`Invalid car data for ${id}:`, rawData);
      return null;
    }

    const normalizedCar: Car = {
      id,
      // Handle name field
      name: rawData.name || `${rawData.brand || 'Unknown'} ${rawData.model || 'Model'}`,
      
      // Handle brand and model
      brand: rawData.brand || 'Unknown Brand',
      model: rawData.model || rawData.name || 'Unknown Model',
      
      // Handle numeric fields with defaults
      year: typeof rawData.year === 'number' ? rawData.year : new Date().getFullYear(),
      mileage: typeof rawData.mileage === 'number' ? rawData.mileage : 0,
      dailyPrice: typeof rawData.dailyPrice === 'number' ? rawData.dailyPrice : 0,
      
      // Handle string fields with defaults
      transmission: rawData.transmission || 'Automatic',
      fuel: rawData.fuel || rawData.fuelType || 'Petrol', // Handle both field names
      category: rawData.category || rawData.type || 'Sedan', // Handle both field names
      description: rawData.description || '',
      
      // Handle arrays with defaults
      images: Array.isArray(rawData.images) ? rawData.images.filter((img: any) => img && typeof img === 'string') : [],
      features: Array.isArray(rawData.features) ? rawData.features : [],
      
      // Handle boolean fields with defaults (check both old and new field names)
      isAvailable: rawData.isAvailable !== undefined ? rawData.isAvailable : (rawData.available !== undefined ? rawData.available : true),
      isFeatured: rawData.isFeatured !== undefined ? rawData.isFeatured : (rawData.featured !== undefined ? rawData.featured : false),
      
      // Keep legacy fields for compatibility
      fuelType: rawData.fuelType,
      type: rawData.type,
      available: rawData.available,
      featured: rawData.featured,
    };

    // Validate essential fields
    if (!normalizedCar.brand || !normalizedCar.name || normalizedCar.dailyPrice <= 0) {
      console.warn(`Car ${id} has invalid essential data:`, {
        brand: normalizedCar.brand,
        name: normalizedCar.name,
        dailyPrice: normalizedCar.dailyPrice
      });
      return null;
    }

    return normalizedCar;
  } catch (error) {
    console.error(`Error normalizing car ${id}:`, error);
    return null;
  }
};

// Brand normalization function
const normalizeBrand = (rawData: any, id: string): Brand | null => {
  try {
    if (!rawData || !rawData.name || !rawData.logo || !rawData.slug) {
      console.warn(`Brand ${id} missing required fields:`, rawData);
      return null;
    }

    return {
      id,
      name: rawData.name,
      logo: rawData.logo,
      slug: rawData.slug,
      featured: rawData.featured || rawData.isFeatured || false,
      carCount: rawData.carCount || 0,
    };
  } catch (error) {
    console.error(`Error normalizing brand ${id}:`, error);
    return null;
  }
};

// Category normalization function
const normalizCategory = (rawData: any, id: string): Category | null => {
  try {
    if (!rawData || !rawData.name || !rawData.slug) {
      console.warn(`Category ${id} missing required fields:`, rawData);
      return null;
    }

    return {
      id,
      name: rawData.name,
      slug: rawData.slug,
      type: rawData.type || 'carType',
      image: rawData.image,
      description: rawData.description,
      carCount: rawData.carCount || 0,
      featured: rawData.featured || rawData.isFeatured || false,
    };
  } catch (error) {
    console.error(`Error normalizing category ${id}:`, error);
    return null;
  }
};

// Validation functions
const isValidCar = (car: any): car is Car => {
  return car && 
         typeof car.id === 'string' &&
         typeof car.brand === 'string' &&
         typeof car.model === 'string' &&
         typeof car.name === 'string' &&
         typeof car.dailyPrice === 'number' &&
         Array.isArray(car.images);
};

const isValidBrand = (brand: any): brand is Brand => {
  return brand && 
         typeof brand.id === 'string' &&
         typeof brand.name === 'string' &&
         typeof brand.logo === 'string' &&
         typeof brand.slug === 'string';
};

const isValidCategory = (category: any): category is Category => {
  return category && 
         typeof category.name === 'string' &&
         typeof category.slug === 'string' &&
         (category.type === 'carType' || category.type === 'fuelType' || category.type === 'tag');
};

// Car services
export const firebaseCarService = {
  getAllCars: async (): Promise<Car[]> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return [];
      }

      const carsSnapshot = await getDocs(collection(db, 'cars'));
      const cars = carsSnapshot.docs
        .map(doc => normalizeCar(doc.data(), doc.id))
        .filter((car): car is Car => car !== null);
      
      console.log(`Retrieved ${cars.length} valid cars out of ${carsSnapshot.docs.length} total`);
      return cars;
    } catch (error) {
      console.error('Error fetching cars from Firebase:', error);
      return [];
    }
  },

  getFeaturedCars: async (): Promise<Car[]> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return [];
      }

      console.log('Attempting to fetch featured cars from Firebase...');
      
      // Try both 'featured' and 'isFeatured' fields
      const [featuredQuery1, featuredQuery2] = await Promise.allSettled([
        getDocs(query(collection(db, 'cars'), where('featured', '==', true), limit(10))),
        getDocs(query(collection(db, 'cars'), where('isFeatured', '==', true), limit(10)))
      ]);

      const allDocs: any[] = [];
      
      if (featuredQuery1.status === 'fulfilled') {
        allDocs.push(...featuredQuery1.value.docs);
      }
      
      if (featuredQuery2.status === 'fulfilled') {
        allDocs.push(...featuredQuery2.value.docs);
      }

      // Remove duplicates by ID
      const uniqueDocs = allDocs.filter((doc, index, self) => 
        index === self.findIndex(d => d.id === doc.id)
      );

      console.log(`Found ${uniqueDocs.length} featured cars in Firebase`);
      
      const cars = uniqueDocs
        .map(doc => normalizeCar(doc.data(), doc.id))
        .filter((car): car is Car => car !== null)
        .slice(0, 6); // Take first 6 valid cars
      
      console.log(`Validated ${cars.length} featured cars`);
      return cars;
    } catch (error) {
      console.error('Error fetching featured cars from Firebase:', error);
      console.error('Error details:', error);
      return [];
    }
  },

  getCarById: async (id: string): Promise<Car | null> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return null;
      }

      if (!id || typeof id !== 'string') {
        console.error('Invalid car ID provided:', id);
        return null;
      }
      
      const carDoc = await getDoc(doc(db, 'cars', id));
      if (carDoc.exists()) {
        return normalizeCar(carDoc.data(), carDoc.id);
      }
      return null;
    } catch (error) {
      console.error('Error fetching car from Firebase:', error);
      return null;
    }
  }
};

// Brand services
export const firebaseBrandService = {
  getAllBrands: async (): Promise<Brand[]> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return [];
      }

      const brandsSnapshot = await getDocs(collection(db, 'brands'));
      const brands = brandsSnapshot.docs
        .map(doc => normalizeBrand(doc.data(), doc.id))
        .filter((brand): brand is Brand => brand !== null);
      
      console.log(`Retrieved ${brands.length} valid brands out of ${brandsSnapshot.docs.length} total`);
      return brands;
    } catch (error) {
      console.error('Error fetching brands from Firebase:', error);
      return [];
    }
  },

  getFeaturedBrands: async (): Promise<Brand[]> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return [];
      }

      console.log('Attempting to fetch featured brands from Firebase...');
      
      // Try both 'featured' and 'isFeatured' fields
      const [featuredQuery1, featuredQuery2] = await Promise.allSettled([
        getDocs(query(collection(db, 'brands'), where('featured', '==', true), limit(12))),
        getDocs(query(collection(db, 'brands'), where('isFeatured', '==', true), limit(12)))
      ]);

      const allDocs: any[] = [];
      
      if (featuredQuery1.status === 'fulfilled') {
        allDocs.push(...featuredQuery1.value.docs);
      }
      
      if (featuredQuery2.status === 'fulfilled') {
        allDocs.push(...featuredQuery2.value.docs);
      }

      // Remove duplicates by ID
      const uniqueDocs = allDocs.filter((doc, index, self) => 
        index === self.findIndex(d => d.id === doc.id)
      );

      console.log(`Found ${uniqueDocs.length} featured brands in Firebase`);
      
      const brands = uniqueDocs
        .map(doc => normalizeBrand(doc.data(), doc.id))
        .filter((brand): brand is Brand => brand !== null)
        .slice(0, 8); // Take first 8 valid brands
      
      console.log(`Validated ${brands.length} featured brands`);
      return brands;
    } catch (error) {
      console.error('Error fetching featured brands from Firebase:', error);
      console.error('Error details:', error);
      return [];
    }
  }
};

// Category services
export const firebaseCategoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return [];
      }

      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      const categories = categoriesSnapshot.docs
        .map(doc => normalizCategory(doc.data(), doc.id))
        .filter((category): category is Category => category !== null);
      
      console.log(`Retrieved ${categories.length} valid categories out of ${categoriesSnapshot.docs.length} total`);
      return categories;
    } catch (error) {
      console.error('Error fetching categories from Firebase:', error);
      return [];
    }
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    try {
      if (!isFirebaseReady() || !db) {
        console.error('Firebase not properly initialized');
        return [];
      }

      console.log('Attempting to fetch featured categories from Firebase...');
      
      // Try both 'featured' and 'isFeatured' fields
      const [featuredQuery1, featuredQuery2] = await Promise.allSettled([
        getDocs(query(collection(db, 'categories'), where('featured', '==', true), limit(8))),
        getDocs(query(collection(db, 'categories'), where('isFeatured', '==', true), limit(8)))
      ]);

      const allDocs: any[] = [];
      
      if (featuredQuery1.status === 'fulfilled') {
        allDocs.push(...featuredQuery1.value.docs);
      }
      
      if (featuredQuery2.status === 'fulfilled') {
        allDocs.push(...featuredQuery2.value.docs);
      }

      // Remove duplicates by ID
      const uniqueDocs = allDocs.filter((doc, index, self) => 
        index === self.findIndex(d => d.id === doc.id)
      );

      console.log(`Found ${uniqueDocs.length} featured categories in Firebase`);
      
      const categories = uniqueDocs
        .map(doc => normalizCategory(doc.data(), doc.id))
        .filter((category): category is Category => category !== null)
        .slice(0, 6); // Take first 6 valid categories
      
      console.log(`Validated ${categories.length} featured categories`);
      return categories;
    } catch (error) {
      console.error('Error fetching featured categories from Firebase:', error);
      console.error('Error details:', error);
      return [];
    }
  }
}; 