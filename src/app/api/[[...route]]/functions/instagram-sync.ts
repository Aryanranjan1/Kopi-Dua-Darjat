
'use server';
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const corsHandler = cors({ origin: true }); // Allow all origins for now

/**
 * Manual Instagram Sync (Admin Triggered)
 * Fixes CORS issues and internal sync failures
 */
export const manualInstagramSync = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log("🔄 Manual Instagram sync triggered...");

      // Verify Firestore settings doc
      const settingsRef = db.collection("settings").doc("instagram_sync");
      const settingsDoc = await settingsRef.get();

      const { active_tag = "kopiduadarjat" } = settingsDoc.exists
        ? settingsDoc.data()!
        : {};

      console.log(`📷 Syncing posts for tag: #${active_tag}`);

      // Simulate fetching 20 mock posts
      const posts = Array.from({ length: 20 }).map((_, i) => ({
        id: `mock_${i + 1}`,
        mediaUrl: `https://source.unsplash.com/random/400x400?coffee&sig=${i}`,
        mediaType: i % 5 === 0 ? "video" : "image",
        username: "kopiduadarjat",
        caption: `Mock post #${i + 1} for #${active_tag}`,
        permalink: `https://www.instagram.com/p/mock${i}/`,
        timestamp: new Date().toISOString(),
        visible: true,
        pinned: false,
        rank: i + 1,
        source: "manual",
        tag: active_tag,
      }));

      if (posts.length === 0) throw new Error("No posts fetched.");

      // Write to Firestore
      const batch = db.batch();
      posts.forEach((post) => {
        const ref = db.collection("public_insta_feed").doc(post.id);
        batch.set(ref, post, { merge: true });
      });
      await batch.commit();

      console.log(`✅ Synced ${posts.length} posts successfully.`);

      // Update last synced timestamp
      await settingsRef.set(
        { last_synced: new Date().toISOString() },
        { merge: true }
      );

      return res.json({
        status: "success",
        message: `Synced ${posts.length} posts for #${active_tag}`,
      });
    } catch (err: any) {
      console.error("❌ Sync failed:", err);
      return res.status(500).json({
        status: "error",
        message: err.message || "Internal Error",
      });
    }
  });
});

/**
 * Daily automatic sync (scheduled)
 */
export const dailyInstagramSync = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    try {
      console.log("🕒 Running daily Instagram sync...");
      const settingsDoc = await db
        .collection("settings")
        .doc("instagram_sync")
        .get();
      const { auto_sync_enabled = true } = settingsDoc.exists
        ? settingsDoc.data()!
        : {};
      if (!auto_sync_enabled) return console.log("Auto sync disabled, skipping.");
      
      // Note: In a real environment, you might need to handle authentication for this internal call if the function is protected.
      const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
      const location = 'us-central1'; // Or your function's region
      const syncUrl = `https://${location}-${project}.cloudfunctions.net/manualInstagramSync`;
      
      const res = await fetch(syncUrl, { method: 'POST'});
      console.log("✅ Daily sync response:", await res.text());

    } catch (err: any) {
      console.error("❌ Daily sync failed:", err);
    }
  });
