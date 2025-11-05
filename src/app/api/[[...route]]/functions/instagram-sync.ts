

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

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
