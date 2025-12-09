import { NextResponse } from "next/server";

export async function GET() {
  // Test endpoint to verify credentials
  return NextResponse.json({
    accountId: process.env.CF_ACCOUNT_ID,
    tokenPresent: !!process.env.CF_STREAM_TOKEN,
    tokenLength: process.env.CF_STREAM_TOKEN?.length || 0,
  });
}

export async function POST() {
  try {
    // Validate environment variables
    if (!process.env.CF_ACCOUNT_ID || !process.env.CF_STREAM_TOKEN) {
      console.error(
        "Missing required environment variables: CF_ACCOUNT_ID or CF_STREAM_TOKEN"
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Call Cloudflare Stream API to create direct upload
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/stream/direct_upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CF_STREAM_TOKEN}`,
        },
        body: JSON.stringify({
          maxDurationSeconds: 3600, // 1 hour max
          requireSignedURLs: false,
          allowedOrigins: ["*"], // In production, restrict this to your domain
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudflare API error:");
      console.error("Status:", response.status);
      console.error("Response:", errorText);
      console.error(
        "Request URL:",
        `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/stream/direct_upload`
      );

      return NextResponse.json(
        {
          error: "Failed to create upload session",
          details: errorText,
          status: response.status,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    if (!data.success) {
      console.error("Cloudflare API returned error:", data.errors);
      return NextResponse.json(
        {
          error: "Cloudflare API error",
          details: data.errors,
        },
        { status: 400 }
      );
    }

    // Return the upload URL and uid for the client
    return NextResponse.json({
      uploadURL: data.result.uploadURL,
      uid: data.result.uid,
    });
  } catch (error) {
    console.error("Error creating direct upload:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
