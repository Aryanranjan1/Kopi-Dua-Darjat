
import { NextResponse } from "next/server";

// This is the URL of your deployed Cloud Function.
// It's recommended to store this in an environment variable.
const FUNCTION_URL = "https://us-central1-studio-5747447299-c92b3.cloudfunctions.net/syncInstagramHybrid";

export async function POST() {
  try {
    // This is a server-to-server call, so it's not blocked by CORS.
    const response = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // If the function returned an error, forward it to the client.
      return NextResponse.json(
        { success: false, message: data.message || "Sync function failed." },
        { status: response.status }
      );
    }
    
    // Forward the successful response from the function to the client.
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API Route Error calling sync function:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred in the proxy." },
      { status: 500 }
    );
  }
}
