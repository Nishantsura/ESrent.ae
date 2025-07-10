#!/usr/bin/env tsx

import { db } from './firebase-admin'
import { Car } from '../src/types/car'

interface FirebaseCarData {
  id?: string;
  name?: string;
  brand?: string;
  model?: string;
  year?: number;
  transmission?: string;
  fuel?: string;
  fuelType?: string;
  mileage?: number;
  dailyPrice?: number;
  images?: string[];
  description?: string;
  features?: string[];
  category?: string;
  type?: string;
  isAvailable?: boolean;
  available?: boolean;
  isFeatured?: boolean;
  featured?: boolean;
  [key: string]: any;
}

async function fixCarData() {
  console.log('🔧 Starting car data migration...');
  
  try {
    // Get all cars from Firebase
    const carsSnapshot = await db.collection('cars').get();
    console.log(`📊 Found ${carsSnapshot.docs.length} cars in database`);

    let fixedCount = 0;
    let errorCount = 0;

    for (const doc of carsSnapshot.docs) {
      try {
        const data = doc.data() as FirebaseCarData;
        const carId = doc.id;
        
        console.log(`\n🚗 Processing car: ${data.name || carId}`);
        
        // Create the normalized car data
        const normalizedData: Partial<Car> = {
          // Ensure all required fields are present
          name: data.name || `${data.brand || 'Unknown'} ${data.model || 'Model'}`,
          brand: data.brand || 'Unknown Brand',
          model: data.model || data.name || 'Unknown Model',
          year: data.year || new Date().getFullYear(),
          transmission: data.transmission || 'Automatic',
          fuel: data.fuel || data.fuelType || 'Petrol', // Normalize to 'fuel'
          mileage: data.mileage || 0,
          dailyPrice: data.dailyPrice || 0,
          images: Array.isArray(data.images) ? data.images : [],
          description: data.description || '',
          features: Array.isArray(data.features) ? data.features : [],
          category: data.category || data.type || 'Sedan', // Normalize to 'category'
          isAvailable: data.isAvailable ?? data.available ?? true, // Normalize to 'isAvailable'
          isFeatured: data.isFeatured ?? data.featured ?? false, // Normalize to 'isFeatured'
        };

        // Also add the 'featured' field for backward compatibility with queries
        const updateData = {
          ...normalizedData,
          featured: normalizedData.isFeatured, // Add for query compatibility
          available: normalizedData.isAvailable, // Add for query compatibility
          updatedAt: new Date().toISOString(),
        };

        // Remove any undefined values
        const cleanedData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== undefined)
        );

        // Update the document
        await db.collection('cars').doc(carId).update(cleanedData);
        
        console.log(`✅ Fixed car: ${normalizedData.name}`);
        console.log(`   - Featured: ${normalizedData.isFeatured}`);
        console.log(`   - Images: ${normalizedData.images?.length || 0}`);
        console.log(`   - Brand: ${normalizedData.brand}`);
        
        fixedCount++;
      } catch (error) {
        console.error(`❌ Error processing car ${doc.id}:`, error);
        errorCount++;
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`✅ Fixed: ${fixedCount} cars`);
    console.log(`❌ Errors: ${errorCount} cars`);

    // Now let's check for featured cars
    const featuredSnapshot = await db.collection('cars').where('featured', '==', true).get();
    console.log(`\n⭐ Found ${featuredSnapshot.docs.length} featured cars`);

    if (featuredSnapshot.docs.length === 0) {
      console.log('\n🔄 No featured cars found. Setting first 6 cars as featured...');
      const firstCarsSnapshot = await db.collection('cars').limit(6).get();
      
      for (const doc of firstCarsSnapshot.docs) {
        await db.collection('cars').doc(doc.id).update({
          featured: true,
          isFeatured: true
        });
        console.log(`⭐ Set ${doc.data().name || doc.id} as featured`);
      }
    }

  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Add a function to check data consistency
async function checkDataConsistency() {
  console.log('\n🔍 Checking data consistency...');
  
  const carsSnapshot = await db.collection('cars').get();
  const issues = [];

  for (const doc of carsSnapshot.docs) {
    const data = doc.data();
    const carId = doc.id;

    // Check for missing required fields
    if (!data.name) issues.push(`${carId}: Missing name`);
    if (!data.brand) issues.push(`${carId}: Missing brand`);
    if (!data.model) issues.push(`${carId}: Missing model`);
    if (!data.dailyPrice || data.dailyPrice <= 0) issues.push(`${carId}: Invalid daily price`);
    if (!Array.isArray(data.images)) issues.push(`${carId}: Invalid images array`);
    if (data.featured === undefined && data.isFeatured === undefined) {
      issues.push(`${carId}: Missing featured flag`);
    }
  }

  if (issues.length > 0) {
    console.log('\n⚠️ Data consistency issues found:');
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    console.log('\n✅ All data looks consistent!');
  }

  return issues.length === 0;
}

// Main execution
async function main() {
  console.log('🚀 AutoLuxe Car Data Migration Tool');
  console.log('==================================');

  // First check current data
  const isConsistent = await checkDataConsistency();
  
  if (!isConsistent) {
    console.log('\n🔧 Running data migration...');
    await fixCarData();
    
    console.log('\n🔍 Re-checking consistency...');
    await checkDataConsistency();
  } else {
    console.log('\n✅ Data is already consistent!');
  }

  console.log('\n✨ Done!');
}

// Run the script
main().catch(console.error);

export { fixCarData, checkDataConsistency }; 