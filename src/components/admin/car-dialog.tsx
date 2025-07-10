'use client';

import { useState, useEffect, useRef } from 'react';
import { Car } from '@/types/car';
import { Brand } from '@/types/brand';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { brandAPI } from '@/services/api';
import { uploadImages } from '@/lib/uploadImages';
import { Image as ImageIcon, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface CarDialogProps {
  car?: Car;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (car: Partial<Car>) => Promise<void>;
}

const defaultCar: Partial<Car> = {
  name: '',
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  transmission: 'Automatic',
  fuel: 'Petrol',
  mileage: 0,
  dailyPrice: 0,
  images: [],
  description: '',
  features: [],
  category: '',
  isAvailable: true,
  isFeatured: false,
};

export function CarDialog({ car, open, onOpenChange, onSave }: CarDialogProps) {
  const [formData, setFormData] = useState<Partial<Car>>(car || defaultCar);
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>(car?.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Reset form data and preview images when car prop changes
    setFormData(car || defaultCar);
    setPreviewImages(car?.images || []);
  }, [car]);

  const [brands, setBrands] = useState<Brand[]>([]);
  type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  type CarType = 'Supercar' | 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Convertible' | 'Wagon';
  const fuelTypes: FuelType[] = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
  const carTypes: CarType[] = ['Supercar', 'SUV', 'Sedan', 'Hatchback', 'Coupe', 'Convertible', 'Wagon'];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brandsData = await brandAPI.getAllBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      // Create temporary preview URLs
      const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviewUrls]);

      // Upload images to Firebase Storage
      const tempId = car?.id || 'temp-' + Date.now(); // Use existing car ID or generate temp ID
      const uploadedUrls = await uploadImages(files, tempId);

      // Update form data with new image URLs
      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedUrls]
      }));

      // Clean up temporary preview URLs
      newPreviewUrls.forEach(URL.revokeObjectURL);
    } catch (error) {
      console.error('Error uploading images:', error);
      // Handle error (show toast notification, etc.)
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name?.trim()) {
      alert('Name is required');
      return;
    }
    if (!formData.brand?.trim()) {
      alert('Brand is required');
      return;
    }
    if (!formData.model?.trim()) {
      alert('Model is required');
      return;
    }
    if (!formData.year || formData.year < 1900) {
      alert('Valid year is required');
      return;
    }
    if (!formData.dailyPrice || formData.dailyPrice <= 0) {
      alert('Valid daily price is required');
      return;
    }
    if (!formData.fuel?.trim()) {
      alert('Fuel type is required');
      return;
    }
    if (!formData.category?.trim()) {
      alert('Category/Type is required');
      return;
    }
    
    // Map frontend Car interface to server expected format
    const carData = {
      // Required fields for server
      name: formData.name.trim(),
      brand: formData.brand.trim(),
      model: formData.model?.trim() || formData.name.trim(),
      year: formData.year || new Date().getFullYear(),
      transmission: formData.transmission || 'Automatic',
      fuelType: formData.fuel || 'Petrol', // Backend expects 'fuelType'
      dailyPrice: formData.dailyPrice || 0,
      type: formData.category || 'Sedan', // Backend expects 'type'
      
      // Optional fields that server accepts
      mileage: formData.mileage || 0,
      images: formData.images || [],
      description: formData.description || '',
      features: formData.features || [],
      available: formData.isAvailable ?? true, // Backend expects 'available'
      featured: formData.isFeatured ?? false, // Backend expects 'featured'
    };
    
    await onSave(carData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">{car ? 'Edit Car' : 'Add New Car'}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Fill in the car details below. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-card-foreground">Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand" className="text-card-foreground">Brand *</Label>
                <Select
                  value={formData.brand || ''}
                  onValueChange={(value) => setFormData({ ...formData, brand: value })}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-card-foreground">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model" className="text-card-foreground">Model</Label>
                <Input
                  id="model"
                  value={formData.model || ''}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Technical Specifications</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission" className="text-card-foreground">Transmission</Label>
                <Select
                  value={formData.transmission || 'Automatic'}
                  onValueChange={(value) => setFormData({ ...formData, transmission: value as 'Manual' | 'Automatic' })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-card-foreground">Fuel Type</Label>
                <Select
                  value={formData.fuel || 'Petrol'}
                  onValueChange={(value: string) => setFormData({ ...formData, fuel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fuelTypes.map((fuelType, index) => (
                      <SelectItem key={`fuel-${index}-${fuelType}`} value={fuelType}>
                        {fuelType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-card-foreground">Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={formData.mileage || ''}
                  onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) || 0 })}
                />
              </div>

            </div>
          </div>

          {/* Pricing and Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Pricing and Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyPrice" className="text-card-foreground">Daily Price *</Label>
                <Input
                  id="dailyPrice"
                  type="number"
                  value={formData.dailyPrice || ''}
                  onChange={(e) => setFormData({ ...formData, dailyPrice: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-card-foreground">Car Type *</Label>
                <Select
                  value={formData.category || ''}
                  onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select car type" />
                  </SelectTrigger>
                  <SelectContent>
                    {carTypes.map((carType, index) => (
                      <SelectItem key={`cartype-${index}-${carType}`} value={carType}>
                        {carType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Features and Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Features and Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAvailable"
                  checked={formData.isAvailable ?? true}
                  onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                />
                <Label htmlFor="isAvailable" className="text-card-foreground">Available for Rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured ?? false}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label htmlFor="isFeatured" className="text-card-foreground">Featured</Label>
              </div>
            </div>
            

          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Images</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Add Images
                    </>
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
              
              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewImages.map((url, index) => (
                  <div key={url} className="relative group aspect-video">
                    <Image
                      src={url}
                      alt={`Car image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-card-foreground">Description</h3>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-card-foreground">Car Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="h-32"
              />
            </div>
          </div>



          <DialogFooter>
            <Button type="submit">Save Car</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
