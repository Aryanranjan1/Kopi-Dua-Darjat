
import { NextResponse } from "next/server";

export async function POST() {
  const functionUrl = "https://us-central1-studio-5747447299-c92b3.cloudfunctions.net/syncInstagramHybrid";
  
  try {
    const res = await fetch(functionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("API Route -> Sync Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
