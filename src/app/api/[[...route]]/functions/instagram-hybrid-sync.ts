import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { InstaFetcher } from "insta-fetcher";
import * as cors from "cors";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ✅ Configure CORS
const corsHandler = cors({
  origin: [
    "http://localhost:3000",
    "https://9000-firebase-studio-1759065889107.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev",
    "https://studio-5747447299-c92b3.web.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
});

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
      media_url: p.media_url,
      media_type: p.media_type,
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
      media_url: p.image_url || p.video_url,
      media_type: p.is_video ? "VIDEO" : "IMAGE",
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

// ✅ Main Function
export const syncInstagramHybrid = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log("🚀 Hybrid Sync triggered at", new Date().toISOString());

      const settingsRef = db.collection("settings").doc("instagram_sync");
      const settingsSnap = await settingsRef.get();

      if (!settingsSnap.exists) {
        console.error("⚠️ Missing settings/instagram_sync document");
        return res.status(500).json({ success: false, message: "Missing settings document" });
      }

      const settings = settingsSnap.data();
      const posts = await fetchPosts(settings);

      // ✅ Delete old data before inserting new ones
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
      res.status(200).json({
        success: true,
        count: posts.length,
        message: `Synced ${posts.length} posts and replaced old data.`,
      });
    } catch (error: any) {
      console.error("🔥 Sync Failed Error Stack:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  });
});
