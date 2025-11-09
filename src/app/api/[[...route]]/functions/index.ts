
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Client } from "@googlemaps/google-maps-services-js";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const googleMapsClient = new Client({});

export const fetchGooglePlaceDetails = functions.https.onCall(async (data, context) => {
  console.log('[Function Start] fetchGooglePlaceDetails invoked.');

  // 1. Explicitly check for the API key from Firebase Functions config.
  const apiKey = functions.config().google?.maps_api_key;
  if (!apiKey) {
    console.error('[Function Error] CRITICAL: GOOGLE_MAPS_API_KEY is not set in Firebase Functions config.');
    throw new functions.https.HttpsError(
      'failed-precondition',
      'The Google Maps API key is missing on the server. Please set it by running: firebase functions:config:set google.maps_api_key="YOUR_API_KEY"'
    );
  }
  console.log('[Function Log] Google Maps API key is present.');

  const placeId = data.placeId;
  if (!placeId) {
    console.error('[Function Error] Place ID is missing from the request data.');
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "placeId" argument.');
  }
  console.log(`[Function Log] Attempting to fetch details for Place ID: ${placeId}`);

  try {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ["name", "formatted_address", "geometry", "international_phone_number", "opening_hours", "url", "address_components"]
      },
    });

    console.log(`[Function Log] Google Places API response status: ${response.data.status}`);

    if (response.data.status !== 'OK') {
      const errorMessage = `Google Places API Error: ${response.data.status}. ${response.data.error_message || 'Check your API key and ensure the Places API is enabled.'}`;
      console.error(`[Function Error] ${errorMessage}`);
      throw new functions.https.HttpsError('internal', errorMessage);
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

    console.log(`[Function Success] Successfully processed data for ${result.name}.`);
    return output;

  } catch (error: any) {
    console.error('[Function CRITICAL] An unexpected error occurred during API call:', error);
    if (error.isHttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', `An unexpected server error occurred: ${error.message}`);
  }
});
