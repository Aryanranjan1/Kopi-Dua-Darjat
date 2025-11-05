
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { InstaFetcher } from "insta-fetcher";

if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = admin.firestore();

export const syncInstagramHybrid = functions.https.onCall(async (_, context) => {
  if (!context.auth) throw new functions.https.HttpsError("unauthenticated", "Admin only");

  const settingsRef = db.collection("settings").doc("instagram_sync");
  const settings = (await settingsRef.get()).data() || {};
  const mode = settings.mode || "scraper";

  console.log(`🚀 Running Instagram sync in ${mode.toUpperCase()} mode`);

  let posts: any[] = [];

  try {
    if (mode === "graph" && settings.graph_access_token && settings.graph_account_id) {
      // ✅ GRAPH API MODE
      const url = `https://graph.instagram.com/${settings.graph_account_id}/media?fields=id,caption,media_url,media_type,permalink,timestamp,username&access_token=${settings.graph_access_token}`;
      const res = await fetch(url);
      const data:any = await res.json();
      if (data.error) throw new Error(data.error.message);

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
      // ✅ SCRAPER MODE
      const tag = settings.active_tag || "kopiduadarjat";
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

    if (!posts.length) throw new Error("No posts fetched");

    const batch = db.batch();
    posts.forEach((p) => {
      const ref = db.collection("public_insta_feed").doc(p.id);
      batch.set(ref, p, { merge: true });
    });
    await batch.commit();

    await settingsRef.update({
      last_synced: new Date().toISOString(),
    });

    console.log(`✅ Synced ${posts.length} posts successfully`);
    return { success: true, count: posts.length, mode };
  } catch (error: any) {
    console.error("❌ Sync failed:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// 🔁 Automatic daily sync
export const dailyHybridSync = functions.pubsub.schedule("every 24 hours").onRun(async () => {
  const settings = (await db.collection("settings").doc("instagram_sync").get()).data();
  if (settings?.auto_sync_enabled) {
    console.log("⏰ Running daily hybrid sync...");
    await syncInstagramHybrid({ auth: { uid: "system" } } as any, {} as any);
  }
});
