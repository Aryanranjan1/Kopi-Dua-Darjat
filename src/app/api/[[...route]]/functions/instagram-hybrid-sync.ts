
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import { InstaFetcher } from "insta-fetcher";
import * as cors from "cors";


if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ✅ CORS handler for safe API calls from browser
const corsHandler = cors({
  origin: [
    "http://localhost:3000",
    "https://9000-firebase-studio-1759065889107.cluster-y75up3teuvc62qmnwys4deqv6y.cloudworkstations.dev",
    "https://studio-5747447299-c92b3.web.app",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
});


// ✅ Main Function
export const syncInstagramHybrid = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === "OPTIONS") {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.status(204).send("");
    }

    try {
      console.log("🚀 Starting Hybrid Instagram Sync...");

      const settingsRef = db.collection("settings").doc("instagram_sync");
      const settings = (await settingsRef.get()).data() || {};
      const mode = settings.mode || "scraper";
      let posts: any[] = [];

      if (mode === "graph" && settings.graph_access_token && settings.graph_account_id) {
        // ✅ GRAPH API MODE
        console.log(`🔗 Fetching Graph API posts for account: ${settings.graph_account_id}`);
        const url = `https://graph.instagram.com/${settings.graph_account_id}/media?fields=id,caption,media_url,media_type,permalink,timestamp,username&access_token=${settings.graph_access_token}`;
        const response = await fetch(url);
        const data = await response.json();
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
        console.log(`🔍 Scraping posts for hashtag: #${tag}`);
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

      // ✅ Write to Firestore
      const batch = db.batch();
      posts.forEach((p) => {
        const ref = db.collection("public_insta_feed").doc(p.id);
        batch.set(ref, p, { merge: true });
      });
      await batch.commit();

      await settingsRef.update({
        last_synced: new Date().toISOString(),
      });

      console.log(`✅ Synced ${posts.length} posts successfully in ${mode} mode`);
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(200).json({
        success: true,
        message: `Synced ${posts.length} posts in ${mode} mode`,
        mode,
        count: posts.length,
      });
    } catch (error: any) {
      console.error("❌ Sync failed:", error);
      res.set("Access-Control-Allow-Origin", "*");
      return res.status(500).json({
        success: false,
        error: error.message || "Internal Server Error",
      });
    }
  });
});
