import { collection, getDocs, doc, getDoc, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Car } from '@/types/car';
import { Brand } from '@/types/brand';
import { Category } from '@/types/category';

// Car services
export const firebaseCarService = {
  getAllCars: async (): Promise<Car[]> => {
    try {
      const carsSnapshot = await getDocs(collection(db, 'cars'));
      return carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Car));
    } catch (error) {
      console.error('Error fetching cars from Firebase:', error);
      return [];
    }
  },

  getFeaturedCars: async (): Promise<Car[]> => {
    try {
      console.log('Attempting to fetch featured cars from Firebase...');
      
      // Check if Firebase is properly configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        console.error('Firebase Project ID is missing from environment variables');
        return [];
      }
      
      const carsQuery = query(
        collection(db, 'cars'),
        where('featured', '==', true),
        limit(6)
      );
      const carsSnapshot = await getDocs(carsQuery);
      console.log(`Found ${carsSnapshot.docs.length} featured cars in Firebase`);
      
      const cars = carsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Car));
      
      console.log('Featured cars data:', cars);
      return cars;
    } catch (error) {
      console.error('Error fetching featured cars from Firebase:', error);
      console.error('Error details:', error);
      return [];
    }
  },

  getCarById: async (id: string): Promise<Car | null> => {
    try {
      const carDoc = await getDoc(doc(db, 'cars', id));
      if (carDoc.exists()) {
        return {
          id: carDoc.id,
          ...carDoc.data()
        } as Car;
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
      const brandsSnapshot = await getDocs(collection(db, 'brands'));
      return brandsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Brand));
    } catch (error) {
      console.error('Error fetching brands from Firebase:', error);
      return [];
    }
  },

  getFeaturedBrands: async (): Promise<Brand[]> => {
    try {
      console.log('Attempting to fetch featured brands from Firebase...');
      const brandsQuery = query(
        collection(db, 'brands'),
        where('featured', '==', true),
        limit(8)
      );
      const brandsSnapshot = await getDocs(brandsQuery);
      console.log(`Found ${brandsSnapshot.docs.length} featured brands in Firebase`);
      
      const brands = brandsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Brand));
      
      console.log('Featured brands data:', brands);
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
      const categoriesSnapshot = await getDocs(collection(db, 'categories'));
      return categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      console.error('Error fetching categories from Firebase:', error);
      return [];
    }
  },

  getFeaturedCategories: async (): Promise<Category[]> => {
    try {
      console.log('Attempting to fetch featured categories from Firebase...');
      const categoriesQuery = query(
        collection(db, 'categories'),
        where('featured', '==', true),
        limit(6)
      );
      const categoriesSnapshot = await getDocs(categoriesQuery);
      console.log(`Found ${categoriesSnapshot.docs.length} featured categories in Firebase`);
      
      const categories = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
      
      console.log('Featured categories data:', categories);
      return categories;
    } catch (error) {
      console.error('Error fetching featured categories from Firebase:', error);
      console.error('Error details:', error);
      return [];
    }
  }
}; 