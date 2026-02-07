import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model, imageData, chatHistory } = body;

    if (!prompt && !imageData) {
      return NextResponse.json(
        { error: "Prompt or image is required" },
        { status: 400 }
      );
    }

    if (!model) {
      return NextResponse.json(
        { error: "Model selection is required" },
        { status: 400 }
      );
    }

    // This route exists as a fallback — the main app uses client-side AI calls.
    // For a production app, you'd move the AI call server-side here.
    return NextResponse.json({
      message: "Use the client-side AI integration for chat.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
