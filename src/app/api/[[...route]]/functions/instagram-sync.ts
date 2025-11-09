
'use server';

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Client } from "@googlemaps/google-maps-services-js";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const syncInstagramPosts = async () => {
  try {
    console.log("Syncing Instagram posts...");
    // Placeholder for actual sync logic
    return { success: true, message: "Sync process started." };
  } catch (error) {
    console.error("Error syncing Instagram posts:", error);
    return { success: false, message: "Sync failed." };
  }
};

const googleMapsClient = new Client({});

export const fetchGooglePlaceDetails = ai.defineFlow(
  {
    name: 'fetchGooglePlaceDetails',
    inputSchema: z.object({ placeId: z.string() }),
    outputSchema: z.object({
        name: z.string(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        lat: z.number(),
        lng: z.number(),
        phone: z.string().optional(),
        hours: z.string().optional(),
        mapsLink: z.string().optional(),
    }),
  },
  async ({ placeId }) => {
    console.log(`[Flow] Starting fetch for Place ID: ${placeId}`);

    if (!process.env.GOOGLE_MAPS_API_KEY) {
        console.error('[Flow] GOOGLE_MAPS_API_KEY is not set.');
        throw new functions.https.HttpsError('internal', 'The server is missing the required API key for Google Maps.');
    }

    try {
        const response = await googleMapsClient.placeDetails({
            params: {
                place_id: placeId,
                key: process.env.GOOGLE_MAPS_API_KEY,
                fields: ["name", "formatted_address", "geometry", "international_phone_number", "opening_hours", "url", "address_components"]
            },
        });

        if (response.data.status !== 'OK') {
            console.error(`[Flow] Google Places API Error: ${response.data.status} - ${response.data.error_message || 'No error message'}`);
            throw new functions.https.HttpsError('internal', `Google Places API Error: ${response.data.status}`);
        }

        const result = response.data.result;
        
        const addressComponents = result.address_components || [];
        const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || '';
        const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name || '';

        const output = {
            name: result.name || '',
            address: result.formatted_address || '',
            city,
            state,
            lat: result.geometry?.location.lat || 0,
            lng: result.geometry?.location.lng || 0,
            phone: result.international_phone_number,
            hours: result.opening_hours?.weekday_text?.join('\n'),
            mapsLink: result.url,
        };

        console.log(`[Flow] Successfully fetched and processed data for ${result.name}.`);
        return output;

    } catch (error: any) {
        console.error('[Flow] An unexpected error occurred:', error);
        if (error.isHttpsError) {
          throw error;
        }
        throw new functions.https.HttpsError('internal', 'An unexpected error occurred while fetching place details.');
    }
  }
);
