'use server';

import * as functions from 'firebase-functions';
import { Client } from '@googlemaps/google-maps-services-js';

const googleMapsClient = new Client({});

// Ensure you have set the API key in your Firebase environment
// firebase functions:config:set google.maps_api_key="YOUR_API_KEY"
const API_KEY = functions.config().google.maps_api_key;

export const fetchGooglePlaceDetails = functions.https.onCall(async (data, context) => {
  const placeId = data.placeId;

  if (!API_KEY) {
    console.error('CRITICAL: GOOGLE_MAPS_API_KEY is not set in Firebase environment config.');
    throw new functions.https.HttpsError(
      'internal',
      'The server is missing the required API key. Please configure it by running: firebase functions:config:set google.maps_api_key="YOUR_API_KEY"'
    );
  }

  if (!placeId) {
    console.error('Error: placeId is required but was not provided.');
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "placeId" argument.');
  }
  
  console.log(`Received request for placeId: ${placeId}`);

  try {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: API_KEY,
        fields: ["name", "formatted_address", "geometry", "international_phone_number", "opening_hours", "url", "address_components"]
      },
    });

    console.log(`Google Places API response status: ${response.data.status}`);

    if (response.data.status !== 'OK') {
        const errorMessage = `Google Places API Error: ${response.data.status}. ${response.data.error_message || 'Check your API key and ensure the Places API is enabled.'}`;
        console.error(errorMessage);
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
      hours: result.opening_hours?.weekday_text?.join('\n') || 'Not available',
      mapsLink: result.url || '',
    };
    
    console.log(`Successfully processed data for ${result.name}.`);
    return output;

  } catch (error: any) {
    console.error('Unhandled error in fetchGooglePlaceDetails:', error);
    if (error.response) {
      console.error('Google API Error Response:', error.response.data);
    }
    throw new functions.https.HttpsError('internal', 'An unexpected error occurred while fetching place details. Check the function logs.');
  }
});
