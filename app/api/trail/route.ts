import { getClientIp, rateLimiter } from "@/lib/rate-limiter";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const ip = getClientIp(req);
    console.log(ip);
    const { success, reset } = await rateLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please register to continue.",
          resetAt: reset,
        },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(req.url);
    const context = searchParams.get("context");

    if (!context) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const customCommand = `Generate 10 questions for the context: ${context}. difficulty level should be mixed of all levels. and i want random number of questions from each level. Single correct answer Format is {type: 'mcq or fill-in-blank or assertion-reason t/f', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string']}. Fill in the Gap (Option-Based) Format is {type: 'string', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string']}. Assertion-Reasoning Format is {type: 'string', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string'], statment: 'string', reason: 'string'}.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: customCommand }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    let questions;
    
    try {
      questions = JSON.parse(rawText?.replace(/```json|```/g, "").trim());
    } catch (error: any) {
      return NextResponse.json(
        {
          error: "Failed to parse Gemini response content.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
