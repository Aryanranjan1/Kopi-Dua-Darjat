
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
 * Manual Instagram Sync with full diagnostics.
 */
export const manualInstagramSync = functions.region("us-central1").https.onRequest((req, res) => {
  console.log("🔥 manualInstagramSync request received");
  console.log("🧾 Method:", req.method);
  console.log("🌐 Origin:", req.headers.origin);
  console.log("🔐 Auth Header:", req.headers.authorization ? "Provided" : "Missing");

  corsHandler(req, res, async () => {
    try {
      if (req.method !== "POST") {
        console.warn("⚠️ Invalid request method:", req.method);
        return res.status(405).json({ error: "Only POST allowed" });
      }

      const settingsRef = db.collection("settings").doc("instagram_sync");
      const settingsDoc = await settingsRef.get();
      console.log("📄 Settings document exists:", settingsDoc.exists);

      const { active_tag = "kopiduadarjat" } = settingsDoc.exists
        ? settingsDoc.data()!
        : {};
      console.log(`📸 Active tag found: #${active_tag}`);

      const posts = Array.from({ length: 10 }).map((_, i) => ({
        id: `debug_${i + 1}`,
        mediaUrl: `https://source.unsplash.com/random/400x400?coffee&sig=${i}`,
        mediaType: i % 3 === 0 ? "video" : "image",
        username: "kopiduadarjat",
        caption: `Debug sync post ${i + 1} for #${active_tag}`,
        permalink: `https://www.instagram.com/p/debug${i}/`,
        timestamp: new Date().toISOString(),
        visible: true,
        pinned: false,
        rank: i + 1,
        source: "debug",
        tag: active_tag,
      }));

      console.log("🧮 Posts generated:", posts.length);

      const batch = db.batch();
      posts.forEach((p) => {
        const ref = db.collection("public_insta_feed").doc(p.id);
        batch.set(ref, p, { merge: true });
      });
      await batch.commit();

      console.log("✅ Firestore write complete. Updating last_synced...");

      await settingsRef.set(
        { last_synced: new Date().toISOString() },
        { merge: true }
      );

      console.log("✅ Sync complete");
      return res.status(200).json({
        status: "success",
        message: `Synced ${posts.length} posts for #${active_tag}`,
      });
    } catch (err: any) {
      console.error("❌ Sync failed:", err);
      return res.status(500).json({
        status: "error",
        message: err.message,
        stack: err.stack,
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
