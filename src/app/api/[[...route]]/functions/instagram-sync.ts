
'use server';
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const syncInstagramPosts = async () => {
  try {
    const tagDoc = await db.collection("settings").doc("instagram_sync").get();
    const { active_tag = "kopiduadarjat" } = tagDoc.exists ? tagDoc.data()! : {};

    console.log(`🔄 Fetching posts for tag: #${active_tag}`);

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

    if (!posts || posts.length === 0) {
      console.warn("No posts fetched.");
      return { status: "no-posts", count: 0 };
    }

    const batch = db.batch();
    posts.forEach((p: any) => {
      const ref = db.collection("public_insta_feed").doc(p.id);
      batch.set(ref, p, { merge: true });
    });
    await batch.commit();

    console.log(`✅ Synced ${posts.length} posts for tag: #${active_tag}`);
    await db.collection("settings").doc("instagram_sync").set(
      { last_synced: new Date().toISOString() },
      { merge: true }
    );

    return { status: "success", count: posts.length };
  } catch (err: any) {
    console.error("❌ Sync failed:", err);
    // Instead of throwing HttpsError, return a serializable error object
    return { status: "error", message: err.message || "Sync failed" };
  }
};
