import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      command,
      topics,
      difficulty,
      numQuestions,
      questionTypes = "mcq",
      prompt,
    } = await req.json();

    if (!command || !topics || !Array.isArray(topics)) {
      return NextResponse.json(
        {
          error:
            'Invalid request body: "command" and "topics" (array) are required.',
        },
        { status: 400 }
      );
    }

    const topicsText = topics.join(", ");
    const questionTypeText = ` in the format of ${questionTypes}. ${
      questionTypes.includes("mcq") && questionTypes !== "mcq"
        ? "mcqs should always be atleast 60-65% of the total questions and others shoud be random "
        : null
    }`;
    console.log(questionTypeText);
    const customCommand = `Generate ${numQuestions} questions${questionTypeText} for the topics ${topicsText} with a difficulty level of ${
      difficulty === "mixed"
        ? "cover all kind of difficluty types includeing miscellaneous"
        : difficulty
    }. Single correct answer Format is {type: 'mcq or fill-in-blank or assertion-reason t/f', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string']}. 
    Fill in the Gap (Option-Based) Format is {type: 'string', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string']}. Assertion-Reasoning Format is {type: 'string', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string'], statment: 'string', reason: 'string'}. ${
      prompt ? "additional instructions: " + prompt : null
    }.`;
    const contents = [{ parts: [{ text: customCommand }] }];

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
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
}
