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
}
