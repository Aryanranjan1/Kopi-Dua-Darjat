'use server';
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();
const corsHandler = cors({ origin: true });

/**
 * Manual Instagram Sync with full CORS + diagnostics + Firestore log.
 * This version uses an onRequest trigger to explicitly handle CORS.
 */
export const manualInstagramSync = functions
  .region("us-central1")
  .https.onRequest((req, res) => {
    // Use the cors middleware to automatically handle CORS headers
    corsHandler(req, res, async () => {
      console.log("🔥 Manual Instagram sync triggered");
      console.log("➡️ Origin:", req.headers.origin);
      console.log("➡️ Method:", req.method);

      // Explicitly handle preflight OPTIONS requests
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      
      if (req.method !== "POST") {
        console.warn("⚠️ Invalid request method:", req.method);
        return res.status(405).json({ error: "Only POST allowed" });
      }

      try {
        const settingsRef = db.collection("settings").doc("instagram_sync");
        const settingsDoc = await settingsRef.get();
        const { active_tag = "kopiduadarjat" } = settingsDoc.exists
          ? settingsDoc.data()!
          : {};

        console.log(`📸 Syncing posts for tag: #${active_tag}`);

        const posts = Array.from({ length: 20 }).map((_, i) => ({
          id: `sync_${Date.now()}_${i}`,
          mediaUrl: `https://picsum.photos/seed/insta${i}/600`,
          mediaType: i % 5 === 0 ? "video" : "image",
          username: "kopiduadarjat_official",
          caption: `Mock post #${i + 1} for #${active_tag}`,
          permalink: `https://www.instagram.com/p/mock${i}/`,
          timestamp: new Date().toISOString(),
          visible: true,
          pinned: false,
          rank: i + 1,
          source: "manual",
          tag: active_tag,
        }));
        
        const batch = db.batch();
        posts.forEach((post) => {
          const ref = db.collection("public_insta_feed").doc(post.id);
          batch.set(ref, post, { merge: true });
        });
        await batch.commit();

        await settingsRef.set(
          { last_synced: new Date().toISOString() },
          { merge: true }
        );
        
        console.log("✅ Sync successful.");
        return res.status(200).json({
          status: "success",
          message: `Synced ${posts.length} posts.`,
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
 * Daily automatic sync (scheduled) which calls the manual sync function.
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

      if (!auto_sync_enabled) {
        console.log("Auto sync disabled, skipping.");
        return;
      }
      
      const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
      const location = 'us-central1';
      const syncUrl = `https://${location}-${project}.cloudfunctions.net/manualInstagramSync`;
      
      const res = await fetch(syncUrl, { method: 'POST'});
      if (!res.ok) {
        throw new Error(`Daily sync call failed with status: ${res.status}`);
      }
      console.log("✅ Daily sync completed successfully.");

    } catch (err: any) {
      console.error("❌ Daily sync failed:", err);
    }
  });
