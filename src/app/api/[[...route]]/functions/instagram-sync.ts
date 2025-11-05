
'use server';

import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// This Cloud Function is scheduled to run every 24 hours.
export const updateInstaFeed = onSchedule('every 24 hours', async (event) => {
  console.log('Running scheduled Instagram feed update...');
  try {
    const response = await fetch(
      'https://www.instagram.com/explore/tags/kopiduadarjat/?__a=1&__d=dis'
    );
    if (!response.ok) {
        throw new Error(`Failed to fetch from Instagram: ${response.statusText}`);
    }
    const data: any = await response.json();

    // The structure of the JSON response from this unofficial endpoint can change.
    // This path `data.graphql.hashtag.edge_hashtag_to_media.edges` is based on current observations.
    const posts = data?.graphql?.hashtag?.edge_hashtag_to_media?.edges || [];

    if (posts.length === 0) {
        console.log('No posts found for hashtag #kopiduadarjat.');
        return;
    }
    
    const batch = db.batch();
    let count = 0;

    // We only take the most recent 20 posts.
    posts.slice(0, 20).forEach((edge: any) => {
      const node = edge.node;
      if (!node || !node.id) return;

      const ref = db.collection('public-insta-feed').doc(node.id.toString());
      
      batch.set(ref, {
        id: node.id,
        username: node.owner?.username || 'kopiduadarjat',
        caption: node.edge_media_to_caption?.edges[0]?.node?.text || '',
        mediaUrl: node.display_url,
        mediaType: node.is_video ? 'video' : 'image',
        permalink: `https://instagram.com/p/${node.shortcode}`,
        timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
      });
      count++;
    });

    await batch.commit();
    console.log(`✅ Insta feed updated successfully with ${count} posts.`);

  } catch (error) {
    console.error('❌ Error updating Instagram feed:', error);
  }
});
