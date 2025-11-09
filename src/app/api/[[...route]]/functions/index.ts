
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Client } from "@googlemaps/google-maps-services-js";

// Initialize Firebase Admin SDK if not already done
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const googleMapsClient = new Client({});

// This is a callable cloud function, not a Genkit flow.
export const fetchGooglePlaceDetails = functions.https.onCall(async (data, context) => {
  console.log('[Function Start] fetchGooglePlaceDetails invoked with data:', JSON.stringify(data));

  const { placeId } = data;
  if (!placeId) {
    console.error('[Function Error] Place ID is missing.');
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "placeId" argument.');
  }

  // IMPORTANT: Access environment variables correctly in Firebase Functions
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('[Function Error] FATAL: GOOGLE_MAPS_API_KEY environment variable is not set.');
    // This is a critical server misconfiguration.
    throw new functions.https.HttpsError('internal', 'The server is missing the required API key for Google Maps. Please contact support.');
  }
  console.log('[Function Log] GOOGLE_MAPS_API_KEY is present.');


  try {
    console.log(`[Function Log] Attempting to fetch details for Place ID: ${placeId}`);
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ["name", "formatted_address", "geometry", "international_phone_number", "opening_hours", "url", "address_components"]
      },
    });

    console.log(`[Function Log] Google Places API response status: ${response.data.status}`);

    if (response.data.status !== 'OK') {
      console.error(`[Function Error] Google Places API returned status ${response.data.status} with error message: ${response.data.error_message}`);
      throw new functions.https.HttpsError('internal', `Google Places API Error: ${response.data.status}. ${response.data.error_message || 'Check your API key and ensure the Places API is enabled.'}`);
    }

    const result = response.data.result;
    
    // Helper to safely extract address components
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
      hours: result.opening_hours?.weekday_text?.join('\n') || 'Not available', // Use newline character
      mapsLink: result.url || '',
    };

    console.log(`[Function Success] Successfully processed data for ${result.name}.`);
    return output;

  } catch (error: any) {
    console.error('[Function CRITICAL] An unexpected error occurred:', error);
    if (error.isHttpsError) {
      throw error; // Re-throw HttpsError directly
    }
    // For other types of errors, wrap them in a generic HttpsError
    throw new functions.https.HttpsError('internal', `An unexpected server error occurred: ${error.message}`);
  }
});
