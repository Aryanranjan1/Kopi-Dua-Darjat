
'use server';

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from "@googlemaps/google-maps-services-js";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const syncInstagramPosts = functions.https.onCall(async (data, context) => {
  console.log("Syncing Instagram posts...");
  // Placeholder for actual sync logic
  return { success: true, message: "Sync process started." };
});


const googleMapsClient = new Client({});

export const fetchGooglePlaceDetails = functions.https.onCall(async (data, context) => {
  console.log('[Function] Starting fetch for Place ID:', data.placeId);

  const { placeId } = data;
  if (!placeId) {
    console.error('[Function] Error: Place ID is missing in the request.');
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "placeId" argument.');
  }
  
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('[Function] FATAL Error: GOOGLE_MAPS_API_KEY is not set in environment variables.');
    throw new functions.https.HttpsError('internal', 'The server is missing the required API key for Google Maps. Please configure it in your environment.');
  }

  try {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ["name", "formatted_address", "geometry", "international_phone_number", "opening_hours", "url", "address_components"]
      },
    });

    if (response.data.status !== 'OK') {
      console.error(`[Function] Google Places API Error: ${response.data.status} - ${response.data.error_message || 'No error message'}`);
      throw new functions.https.HttpsError('internal', `Google Places API Error: ${response.data.status}. ${response.data.error_message || ''}`);
    }

    const result = response.data.result;
    
    const addressComponents = result.address_components || [];
    const getAddressComponent = (type: string) => addressComponents.find(c => c.types.includes(type))?.long_name || '';
    
    const city = getAddressComponent('locality') || getAddressComponent('administrative_area_level_3') || getAddressComponent('postal_town');
    const state = getAddressComponent('administrative_area_level_1');

    const output = {
      name: result.name || '',
      address: result.formatted_address || '',
      city: city,
      state: state,
      lat: result.geometry?.location.lat || 0,
      lng: result.geometry?.location.lng || 0,
      phone: result.international_phone_number || '',
      hours: result.opening_hours?.weekday_text?.join('\\n') || 'Not available',
      mapsLink: result.url || '',
    };

    console.log(`[Function] Successfully fetched and processed data for ${result.name}.`);
    return output;

  } catch (error: any) {
    console.error('[Function] An unexpected error occurred while calling Google Maps API:', error);
    if (error.isHttpsError) {
      throw error;
    }
    // Re-throw other errors as internal to be caught by the client.
    throw new functions.https.HttpsError('internal', `An unexpected server error occurred: ${error.message}`);
  }
});
