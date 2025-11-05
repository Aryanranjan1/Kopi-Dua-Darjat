
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { InstaFetcher } from "insta-fetcher";
import * as cors from "cors";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ✅ Function to fetch posts
async function fetchPosts(settings: any) {
  const mode = settings.mode || "scraper";
  const tag = settings.active_tag || "kopiduadarjat";
  let posts: any[] = [];

  console.log("⚙️ Fetch mode:", mode);
  console.log("📌 Active tag:", tag);

  if (mode === "graph" && settings.graph_access_token && settings.graph_account_id) {
    // GRAPH API MODE
    const url = `https://graph.instagram.com/${settings.graph_account_id}/media?fields=id,caption,media_url,media_type,permalink,timestamp,username&access_token=${settings.graph_access_token}`;
    console.log("🔗 Fetching Graph API:", url);

    const response = await fetch(url);
    const data = await response.json() as any;

    if (data.error) {
      console.error("❌ Graph API error:", data.error);
      throw new Error(data.error.message);
    }

    posts = data.data.slice(0, 20).map((p: any, i: number) => ({
      id: p.id,
      mediaUrl: p.media_url,
      mediaType: p.media_type,
      username: p.username || "kopiduadarjat",
      caption: p.caption || "",
      permalink: p.permalink,
      timestamp: p.timestamp,
      visible: true,
      pinned: false,
      rank: i + 1,
      source: "graph",
    }));
  } else {
    // SCRAPER MODE
    console.log(`🔍 Scraping posts for #${tag}`);
    const fetcher = new InstaFetcher();

    const fetched = await fetcher.fetchTagPosts(tag, 20);
    posts = fetched.map((p: any, i: number) => ({
      id: p.id.toString(),
      mediaUrl: p.image_url || p.video_url,
      mediaType: p.is_video ? "VIDEO" : "IMAGE",
      username: p.username,
      caption: p.caption,
      permalink: p.url,
      timestamp: p.timestamp,
      visible: true,
      pinned: false,
      rank: i + 1,
      source: "scraper",
    }));
  }

  if (!posts.length) throw new Error("No posts fetched.");
  return posts;
}

export const syncInstagramHybrid = functions.https.onCall(async (data, context) => {
    // Check if the user is authenticated.
    // if (!context.auth) {
    //     throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    // }

    try {
      console.log("🚀 Hybrid Sync triggered at", new Date().toISOString());

      const settingsRef = db.collection("settings").doc("instagram_sync");
      const settingsSnap = await settingsRef.get();

      if (!settingsSnap.exists) {
        console.error("⚠️ Missing settings/instagram_sync document");
        throw new functions.https.HttpsError('not-found', 'Missing settings document');
      }

      const settings = settingsSnap.data();
      const posts = await fetchPosts(settings);

      console.log("🗑 Clearing old data in public_insta_feed...");
      const oldPosts = await db.collection("public_insta_feed").get();
      const deleteBatch = db.batch();
      oldPosts.forEach((doc) => deleteBatch.delete(doc.ref));
      await deleteBatch.commit();

      console.log("📤 Uploading new posts...");
      const batch = db.batch();
      posts.forEach((p) => {
        const ref = db.collection("public_insta_feed").doc(p.id);
        batch.set(ref, p);
      });
      await batch.commit();

      await settingsRef.update({
        last_synced: new Date().toISOString(),
      });

      console.log(`✅ Synced ${posts.length} posts successfully.`);
      return {
        success: true,
        count: posts.length,
        message: `Synced ${posts.length} posts and replaced old data.`,
      };
    } catch (error: any) {
      console.error("🔥 Sync Failed Error Stack:", error);
      throw new functions.https.HttpsError("internal", error.message || "Internal Server Error");
    }
});
