import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@googlemaps/google-maps-services-js";

const googleMapsClient = new Client({});

export async function POST(req: NextRequest) {
  console.log('[API Route Start] /api/fetch-google-place-details invoked.');

  const { placeId } = await req.json();

  if (!placeId) {
    console.error('[API Route Error] Place ID is missing from the request body.');
    return NextResponse.json({ message: 'Place ID is required.' }, { status: 400 });
  }
  console.log(`[API Route Log] Received Place ID: ${placeId}`);

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error('[API Route Error] CRITICAL: GOOGLE_MAPS_API_KEY environment variable is not set.');
    return NextResponse.json({ message: 'Server configuration error: Google Maps API key is missing.' }, { status: 500 });
  }
  console.log('[API Route Log] Google Maps API key is present.');

  try {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        key: apiKey,
        fields: ["name", "formatted_address", "geometry", "international_phone_number", "opening_hours", "url", "address_components"]
      },
    });

    console.log(`[API Route Log] Google Places API response status: ${response.data.status}`);

    if (response.data.status !== 'OK') {
      const errorMessage = `Google Places API Error: ${response.data.status}. ${response.data.error_message || 'Check your API key and ensure the Places API is enabled.'}`;
      console.error(`[API Route Error] ${errorMessage}`);
      return NextResponse.json({ message: errorMessage }, { status: 500 });
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

    console.log(`[API Route Success] Successfully processed data for ${result.name}.`);
    return NextResponse.json(output, { status: 200 });

  } catch (error: any) {
    console.error('[API Route CRITICAL] An unexpected error occurred during API call:', error);
    return NextResponse.json({ message: `An unexpected server error occurred: ${error.message}` }, { status: 500 });
  }
}