
'use server';

import { onSchedule } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import fetch from 'node-fetch';
import { onCall } from 'firebase-functions/v2/https';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

async function syncInstagramPosts() {
  console.log('Running scheduled Instagram feed update...');
  
  const settingsRef = db.collection('settings').doc('instagram_sync');
  const settingsSnap = await settingsRef.get();
  const settings = settingsSnap.data() || {};
  const activeTag = settings.active_tag || 'kopiduadarjat';

  try {
    const response = await fetch(
      `https://www.instagram.com/explore/tags/${activeTag}/?__a=1&__d=dis`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch from Instagram: ${response.statusText}`);
    }
    const data: any = await response.json();

    const posts = data?.graphql?.hashtag?.edge_hashtag_to_media?.edges || [];

    if (posts.length === 0) {
      console.log(`No posts found for hashtag #${activeTag}.`);
      await settingsRef.set({ last_synced: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return;
    }

    const batch = db.batch();
    let count = 0;

    posts.slice(0, 20).forEach((edge: any) => {
      const node = edge.node;
      if (!node || !node.id) return;

      const ref = db.collection('public_insta_feed').doc(node.id.toString());
      
      batch.set(ref, {
        id: node.id,
        username: node.owner?.username || 'unknown',
        caption: node.edge_media_to_caption?.edges[0]?.node?.text || '',
        mediaUrl: node.display_url,
        mediaType: node.is_video ? 'video' : 'image',
        permalink: `https://instagram.com/p/${node.shortcode}`,
        timestamp: new Date(node.taken_at_timestamp * 1000).toISOString(),
        visible: true,
        pinned: false,
        source: 'scrape',
        rank: count,
        tag: activeTag,
      }, { merge: true }); // Merge to preserve pinned/visible status
      count++;
    });

    await batch.commit();
    await settingsRef.set({ last_synced: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    console.log(`✅ Insta feed updated successfully with ${count} posts.`);
    return { status: 'success', message: `Sync completed. Found ${count} posts.` };
  } catch (error) {
    console.error('❌ Error updating Instagram feed:', error);
    throw new Error('Failed to sync Instagram feed.');
  }
}

export const dailyInstagramSync = onSchedule('every 24 hours', async (event) => {
  const settingsSnap = await db.collection('settings').doc('instagram_sync').get();
  if (settingsSnap.exists && settingsSnap.data()?.auto_sync_enabled) {
    await syncInstagramPosts();
  } else {
    console.log('Auto-sync is disabled. Skipping scheduled run.');
  }
});

export const manualInstagramSync = onCall(async (request) => {
    // NOTE: Add admin check here in a real application
    // const uid = request.auth?.uid;
    // const adminRef = db.collection('roles_admin').doc(uid);
    // const adminSnap = await adminRef.get();
    // if (!adminSnap.exists) {
    //   throw new functions.https.HttpsError("permission-denied", "Must be an admin to trigger sync.");
    // }
    return await syncInstagramPosts();
});
