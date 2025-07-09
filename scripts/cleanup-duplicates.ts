import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Firebase Admin if not already initialized
if (getApps().length === 0) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  console.log('Project ID:', serviceAccount.projectId);
  console.log('Client Email:', serviceAccount.clientEmail);
  console.log('Private Key exists:', !!serviceAccount.privateKey);

  if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
    throw new Error('Missing Firebase Admin credentials');
  }

  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

async function cleanupDuplicateBrands() {
  try {
    console.log('🧹 Starting cleanup of duplicate brands...');
    
    // Get all brands
    const brandsSnapshot = await db.collection('brands').get();
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Array<{id: string, name?: string}>;
    
    // Find duplicates by name
    const brandNames = new Map<string, any>();
    const duplicates: Array<{id: string, name?: string}> = [];
    
    brands.forEach(brand => {
      const name = brand.name?.trim();
      if (name && brandNames.has(name)) {
        duplicates.push(brand);
      } else if (name) {
        brandNames.set(name, brand);
      }
    });
    
    console.log(`Found ${duplicates.length} duplicate brands:`);
    duplicates.forEach(brand => {
      console.log(`  - ${brand.name} (ID: ${brand.id})`);
    });
    
    // Delete duplicates (keep the first occurrence)
    for (const duplicate of duplicates) {
      console.log(`Deleting duplicate: ${duplicate.name} (${duplicate.id})`);
      await db.collection('brands').doc(duplicate.id).delete();
    }
    
    console.log('✅ Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

cleanupDuplicateBrands(); 