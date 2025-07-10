export interface Car {
  id: string;
  brand: string;
  model: string;
  name: string;
  year: number;
  transmission: string;
  fuel: string;
  mileage: number;
  dailyPrice: number;
  images: string[];
  description?: string;
  features?: string[];
  category?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  
  // Legacy fields for backward compatibility
  fuelType?: string; // Some cars might use this instead of 'fuel'
  type?: string; // Some cars might use this instead of 'category'
  available?: boolean; // Some cars might use this instead of 'isAvailable'
  featured?: boolean; // Some cars might use this instead of 'isFeatured'
}
