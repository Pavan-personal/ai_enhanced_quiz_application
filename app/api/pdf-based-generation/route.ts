import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { command, description } = await req.json();

    if (!command || !description) {
      return NextResponse.json(
        {
          error:
            'Invalid request body: "command" and "description" are required.',
        },
        { status: 400 }
      );
    }

    const contents = [
      {
        parts: [
          {
            text: `${command} Description: ${description} option format is 'index of correct option'.`,
          },
        ],
      },
    ];

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        {
          error:
            "API key is missing. Please configure GEMINI_API_KEY in your environment variables.",
        },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: "Error from Gemini API", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedText = rawText?.replace(/```json|```/g, "").trim();

    let formattedJson;
    try {
      formattedJson = JSON.parse(cleanedText);
    } catch (error: any) {
      return NextResponse.json(
        {
          error: "Failed to parse Gemini response content.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: formattedJson });
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
}
