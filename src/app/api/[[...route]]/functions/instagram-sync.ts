

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const syncInstagramPosts = async () => {
  try {
    // Get the active tag from Firestore
    const tagDoc = await db.collection("settings").doc("instagram_sync").get();
    const { active_tag = "kopiduadarjat" } = tagDoc.exists ? tagDoc.data()! : {};

    console.log(`🔄 Fetching posts for tag: #${active_tag}`);

    // Mock fetcher (replace with API call later)
    const posts = Array.from({ length: 20 }).map((_, i) => ({
      id: `mock_${i + 1}`,
      mediaUrl: `https://source.unsplash.com/random/400x400?coffee&sig=${i}`,
      mediaType: i % 5 === 0 ? "VIDEO" : "IMAGE",
      username: "kopiduadarjat",
      caption: `Sample post #${i + 1} for #${active_tag}`,
      permalink: `https://www.instagram.com/p/mock${i}/`,
      timestamp: new Date().toISOString(),
      visible: true,
      pinned: false,
      rank: i + 1,
      source: "manual",
      tag: active_tag,
    }));

    if (!posts || posts.length === 0) throw new Error("No posts fetched.");

    const batch = db.batch();
    posts.forEach((p) => {
      const ref = db.collection("public_insta_feed").doc(p.id);
      batch.set(ref, p, { merge: true });
    });
    await batch.commit();

    console.log(`✅ Synced ${posts.length} posts for tag: #${active_tag}`);
    await db.collection("settings").doc("instagram_sync").update({
      last_synced: new Date().toISOString(),
    });

    return { status: "success", count: posts.length };
  } catch (err: any) {
    console.error("❌ Sync failed:", err);
    throw new functions.https.HttpsError("internal", err.message || "Sync failed");
  }
};


export const fetchGooglePlaceDetails = async (placeId: string) => {
    if (!placeId) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with a "placeId" argument.');
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        throw new functions.https.HttpsError('failed-precondition', 'The Google Maps API key is not configured.');
    }

    const fields = 'name,formatted_address,geometry,formatted_phone_number,opening_hours,photos,place_id,url,rating,user_ratings_total,reviews';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data: any = await response.json();

        if (data.status !== 'OK') {
            throw new functions.https.HttpsError('not-found', `Google Places API error: ${data.status} - ${data.error_message || ''}`);
        }

        const result = data.result;

        const getAddressComponent = (type: string) => {
            const component = result.address_components?.find((c: any) => c.types.includes(type));
            return component ? component.long_name : '';
        };

        const city = getAddressComponent('locality') || getAddressComponent('administrative_area_level_2');
        const state = getAddressComponent('administrative_area_level_1');

        const outletData = {
            name: result.name || '',
            address: result.formatted_address || '',
            city: city,
            state: state,
            lat: result.geometry?.location?.lat || 0,
            lng: result.geometry?.location?.lng || 0,
            phone: result.formatted_phone_number || '',
            hours: result.opening_hours?.weekday_text?.join('\n') || '',
            mapsLink: result.url || '',
            rating: result.rating || 0,
            reviewCount: result.user_ratings_total || 0,
            reviews: result.reviews || [],
            photos: result.photos?.slice(0, 5).map((p: any) => ({
                photo_reference: p.photo_reference,
                height: p.height,
                width: p.width,
                html_attributions: p.html_attributions,
                url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1080&photoreference=${p.photo_reference}&key=${apiKey}`
            })) || [],
        };
        
        return outletData;
    } catch (error: any) {
        console.error('Error fetching from Google Places API:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        throw new functions.https.HttpsError('internal', 'An unexpected error occurred while fetching place details.');
    }
};
