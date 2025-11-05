import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import fetch from "node-fetch";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();
const corsHandler = cors({ origin: true });

export const syncInstagramHybrid = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log("🚀 SyncInstagramHybrid triggered");

      const tagDoc = await db.collection("settings").doc("instagram_sync").get();
      const tag = tagDoc.exists ? tagDoc.data()?.active_tag || "kopiduadarjat" : "kopiduadarjat";

      console.log(`🔍 Fetching posts for #${tag}`);

      // Simulated Scraper (replace later with Graph API)
      const posts = Array.from({ length: 20 }).map((_, i) => ({
        id: `mock_${i + 1}`,
        media_url: `https://source.unsplash.com/random/400x400?coffee&sig=${i}`,
        media_type: i % 3 === 0 ? "VIDEO" : "IMAGE",
        username: "kopiduadarjat",
        caption: `Sample Post #${i + 1} for #${tag}`,
        permalink: `https://www.instagram.com/p/mock${i}/`,
        timestamp: new Date().toISOString(),
        visible: true,
        pinned: false,
        rank: i + 1,
        source: "scraper",
        tag,
      }));

      const batch = db.batch();
      const collectionRef = db.collection("public_insta_feed");

      // Clear existing feed before seeding new
      const snapshot = await collectionRef.get();
      snapshot.forEach((doc) => batch.delete(doc.ref));

      posts.forEach((p) => {
        const ref = collectionRef.doc(p.id);
        batch.set(ref, p);
      });

      await batch.commit();

      await db.collection("settings").doc("instagram_sync").set({
        last_synced: new Date().toISOString(),
        active_tag: tag,
        auto_sync_enabled: true,
      }, { merge: true });

      console.log(`✅ Synced ${posts.length} posts for #${tag}`);
      return res.status(200).json({ success: true, count: posts.length, tag });
    } catch (error: any) {
      console.error("❌ Sync Failed:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  });
});
