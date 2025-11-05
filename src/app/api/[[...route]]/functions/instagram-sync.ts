
'use server';
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const corsHandler = cors({ origin: true });

/**
 * Manual Instagram Sync with full diagnostics + Firestore log.
 */
export const manualInstagramSync = functions
  .region("us-central1")
  .https.onRequest((req, res) => {
    corsHandler(req, res, async () => {
      console.log("🔥 Manual Instagram sync triggered");
      console.log("➡️ Origin:", req.headers.origin);
      console.log("➡️ Method:", req.method);
      console.log("➡️ Auth header:", req.headers.authorization || "none");

      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

      if (req.method === "OPTIONS") {
        console.log("🟡 Preflight check passed");
        return res.status(204).send("");
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

        console.log(`📸 Active tag: #${active_tag}`);

        // Generate sample posts for testing
        const posts = Array.from({ length: 10 }).map((_, i) => ({
          id: `sync_${Date.now()}_${i}`,
          mediaUrl: `https://source.unsplash.com/random/400x400?coffee&sig=${i}`,
          mediaType: i % 3 === 0 ? "video" : "image",
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

        console.log("🧮 Generated mock posts:", posts.length);

        const batch = db.batch();
        posts.forEach((p) => {
          const ref = db.collection("public_insta_feed").doc(p.id);
          batch.set(ref, p, { merge: true });
        });
        await batch.commit();

        console.log("✅ Firestore write complete");

        // Log a sync confirmation document
        const logRef = db.collection("sync_logs").doc();
        await logRef.set({
          tag: active_tag,
          timestamp: new Date().toISOString(),
          post_count: posts.length,
          origin: req.headers.origin || "unknown",
          status: "success",
        });

        // Update settings last_synced
        await settingsRef.set(
          { last_synced: new Date().toISOString() },
          { merge: true }
        );

        console.log("✅ Sync successful for tag:", active_tag);
        return res.status(200).json({
          status: "success",
          message: `Synced ${posts.length} posts for #${active_tag}`,
        });
      } catch (err: any) {
        console.error("❌ Sync failed:", err);
        await db.collection("sync_logs").add({
          timestamp: new Date().toISOString(),
          error: err.message || "unknown error",
          stack: err.stack,
          origin: req.headers.origin || "unknown",
          status: "failed",
        });
        return res.status(500).json({
          status: "error",
          message: err.message || "Internal error",
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
      
      const project = JSON.parse(process.env.FIREBASE_CONFIG!).projectId;
      const location = 'us-central1'; // Or your function's region
      const syncUrl = `https://${location}-${project}.cloudfunctions.net/manualInstagramSync`;
      
      const res = await fetch(syncUrl, { method: 'POST'});
      console.log("✅ Daily sync response:", await res.text());

    } catch (err: any) {
      console.error("❌ Daily sync failed:", err);
    }
  });

