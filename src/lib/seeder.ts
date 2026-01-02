
'use client';

import { collection, writeBatch, getDocs, doc, Firestore, query, serverTimestamp, setDoc } from 'firebase/firestore';

export async function seedSiteSettings(firestore: Firestore) {
  const settingsRef = doc(firestore, 'settings', 'main');
  
  const settingsData = {
    brand: {
      name: 'Kopi Dua Darjat',
      tagline: 'Antara Warisan & Artisan.',
      favicon: null,
      primaryColor: null,
      accentColor: null,
    },
    founders: [],
    contact: {
      email: 'hello@kopiduadarjat.com',
      phone: '+60 12-345 6789',
      address: 'Kuala Lumpur, Malaysia',
      googleMapsLink: 'https://maps.google.com',
      businessHours: '9 AM - 10 PM Daily',
    },
    socials: {
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      tiktok: 'https://tiktok.com',
      youtube: 'https://youtube.com',
      whatsapp: 'https://wa.me/60198765432'
    },
    automation: {
        instagramSyncEnabled: false,
        instagramApiKey: '',
        marketingEngineEnabled: false,
        marketingApiKey: '',
        analyticsEnabled: false,
        analyticsApiKey: '',
        appCheckEnforced: true,
        recaptchaSiteKey: '',
    },
    meta: {
      defaultTitle: 'Kopi Dua Darjat - Antara Warisan & Artisan',
      defaultDescription: 'Experience the perfect blend of heritage and artisan coffee. 50+ outlets serving quality Kopi Kampung from RM3.',
      keywords: ['Kopi Dua Darjat', 'kopi kampung', 'artisan coffee', 'malaysian cafe', 'franchise kopi'],
      defaultImageId: null,
    },
    lastUpdated: serverTimestamp(),
    updatedBy: 'system-seed',
  };

  await setDoc(settingsRef, settingsData, { merge: true });
}

