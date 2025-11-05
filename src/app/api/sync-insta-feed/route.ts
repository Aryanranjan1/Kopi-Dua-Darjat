
import { NextResponse } from "next/server";
import { httpsCallable } from "firebase/functions";
import { getFunctions } from "firebase/functions";
import { initializeServerSideFirebase } from "@/firebase/server-init";

export async function POST() {
  try {
    // Initialize Firebase Admin SDK on the server-side
    initializeServerSideFirebase();
    const functions = getFunctions();

    // Get a reference to the callable function
    const syncFunction = httpsCallable(functions, 'syncInstagramHybrid');

    // Call the function
    const result = await syncFunction();
    
    // Return the result from the function to the client
    return NextResponse.json(result.data);

  } catch (error: any) {
    console.error("API Route Error calling syncInstagramHybrid:", error);
    // Return a structured error response
    return NextResponse.json(
      { success: false, message: error.message || "An internal server error occurred." },
      { status: 500 }
    );
  }
}
