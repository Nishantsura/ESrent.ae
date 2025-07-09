import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

async function testAdminAuth() {
  try {
    console.log('🔐 Testing admin authentication...');
    
    // Sign in with admin credentials
    const email = 'admin@autoluxe.com';
    const password = 'AutoLuxe2025!';
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Successfully signed in:', userCredential.user.email);
    
    // Get the auth token
    const token = await userCredential.user.getIdToken();
    console.log('✅ Got auth token:', token.substring(0, 50) + '...');
    
    const baseUrl = 'http://localhost:3001';
    const timestamp = Date.now();
    
    console.log('\n🧪 **COMPREHENSIVE ADMIN OPERATIONS TEST**\n');
    
    // === TEST 1: CAR OPERATIONS ===
    console.log('🚗 **TESTING CAR OPERATIONS**');
    
    // CREATE car
    const testCar = {
      name: `Test Car ${timestamp}`,
      brand: 'BMW',
      model: 'X5',
      year: 2024,
      transmission: 'Automatic',
      fuel: 'Petrol',
      dailyPrice: 300,
      category: 'SUV',
      mileage: 10000,
      description: 'Test car for comprehensive testing',
      features: ['Bluetooth', 'Navigation'],
      images: [],
      isAvailable: true,
      isFeatured: false
    };
    
    const carResponse = await fetch(`${baseUrl}/api/cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(testCar)
    });
    
    let carId = '';
    if (carResponse.ok) {
      const carResult = await carResponse.json();
      carId = carResult.id;
      console.log('✅ Car created successfully! ID:', carId);
    } else {
      console.log('❌ Car creation failed:', await carResponse.text());
      return;
    }
    
    // UPDATE car
    const updateResponse = await fetch(`${baseUrl}/api/cars/${carId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ dailyPrice: 350, description: 'Updated description' })
    });
    
    if (updateResponse.ok) {
      console.log('✅ Car updated successfully!');
    } else {
      console.log('❌ Car update failed:', await updateResponse.text());
    }
    
    // DELETE car
    const deleteResponse = await fetch(`${baseUrl}/api/cars/${carId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    
    if (deleteResponse.ok) {
      console.log('✅ Car deleted successfully!');
    } else {
      console.log('❌ Car deletion failed:', await deleteResponse.text());
    }
    
    // === TEST 2: BRAND OPERATIONS ===
    console.log('\n🏢 **TESTING BRAND OPERATIONS**');
    
    // CREATE brand
    const testBrand = {
      name: `Test Brand ${timestamp}`,
      description: 'Test brand for comprehensive testing',
      featured: false
    };
    
    const brandResponse = await fetch(`${baseUrl}/api/brands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(testBrand)
    });
    
    let brandId = '';
    if (brandResponse.ok) {
      const brandResult = await brandResponse.json();
      brandId = brandResult.id;
      console.log('✅ Brand created successfully! ID:', brandId);
    } else {
      console.log('❌ Brand creation failed:', await brandResponse.text());
      return;
    }
    
    // UPDATE brand
    const brandUpdateResponse = await fetch(`${baseUrl}/api/brands/${brandId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ description: 'Updated brand description', featured: true })
    });
    
    if (brandUpdateResponse.ok) {
      console.log('✅ Brand updated successfully!');
    } else {
      console.log('❌ Brand update failed:', await brandUpdateResponse.text());
    }
    
    // DELETE brand
    const brandDeleteResponse = await fetch(`${baseUrl}/api/brands/${brandId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    
    if (brandDeleteResponse.ok) {
      console.log('✅ Brand deleted successfully!');
    } else {
      console.log('❌ Brand deletion failed:', await brandDeleteResponse.text());
    }
    
    // === TEST 3: CATEGORY OPERATIONS ===
    console.log('\n📂 **TESTING CATEGORY OPERATIONS**');
    
    // CREATE category
    const testCategory = {
      name: `Test Category ${timestamp}`,
      type: 'tag',
      description: 'Test category for comprehensive testing',
      featured: false
    };
    
    const categoryResponse = await fetch(`${baseUrl}/api/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(testCategory)
    });
    
    let categoryId = '';
    if (categoryResponse.ok) {
      const categoryResult = await categoryResponse.json();
      categoryId = categoryResult.id;
      console.log('✅ Category created successfully! ID:', categoryId);
    } else {
      console.log('❌ Category creation failed:', await categoryResponse.text());
      return;
    }
    
    // UPDATE category
    const categoryUpdateResponse = await fetch(`${baseUrl}/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ description: 'Updated category description', featured: true })
    });
    
    if (categoryUpdateResponse.ok) {
      console.log('✅ Category updated successfully!');
    } else {
      console.log('❌ Category update failed:', await categoryUpdateResponse.text());
    }
    
    // DELETE category
    const categoryDeleteResponse = await fetch(`${baseUrl}/api/categories/${categoryId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
    });
    
    if (categoryDeleteResponse.ok) {
      console.log('✅ Category deleted successfully!');
    } else {
      console.log('❌ Category deletion failed:', await categoryDeleteResponse.text());
    }
    
    // Sign out
    await auth.signOut();
    console.log('\n✅ Signed out successfully');
    console.log('🎉 **ALL TESTS COMPLETED!**');
    console.log('📊 **SUMMARY**: All CREATE, UPDATE, and DELETE operations tested for Cars, Brands, and Categories!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminAuth(); 