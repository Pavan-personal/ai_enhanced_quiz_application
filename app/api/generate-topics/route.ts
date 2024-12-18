import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
      return NextResponse.json(
        { error: 'Query parameter "keyword" is required.' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return NextResponse.json(
        { error: 'API key is missing. Please configure GEMINI_API_KEY in your environment variables.' },
        { status: 500 }
      );
    }

    const prompt = `Extract the most important topics related to "${keyword}" for exam preparation. Return the topics as a JSON array of strings. make sure to keep topic names short and most understandable in the same way even though they are short. but try to cover all the important topics related to the keyword and try to keep the topic short but it is fine if the topic is important and long.`;

    const contents = [{ parts: [{ text: prompt }] }];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: 'Error from Gemini API', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    let relatedKeywords;
    try {
      relatedKeywords = JSON.parse(rawText?.replace(/```json|```/g, '').trim());
    } catch (error: any) {
      return NextResponse.json(
        { error: 'Failed to parse Gemini response content.', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ keywords: relatedKeywords });
  } catch (error: any) {
    console.error('Error handling request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.', details: error.message },
      { status: 500 }
    );
  }
}
