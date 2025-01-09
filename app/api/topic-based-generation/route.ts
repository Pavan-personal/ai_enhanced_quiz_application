import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      keyword,
      topics,
      difficulty,
      numQuestions,
      questionTypes = "mcq",
      prompt,
    } = await req.json();

    if (!keyword || !topics || !Array.isArray(topics)) {
      return NextResponse.json(
        {
          error:
            'Invalid request body: "keyword" and "topics" (array) are required.',
        },
        { status: 400 }
      );
    }

    const topicsText = topics.join(", ");
    const questionTypeText = ` in the format of ${questionTypes}. ${
      questionTypes.includes("mcq") && questionTypes !== "mcq"
        ? "mcqs should always be atleast 60-65% of the total questions and others should be random "
        : ""
    }`;

    const customCommand = `Generate ${numQuestions} questions${questionTypeText} for the topics ${topicsText} with a difficulty level of ${
      difficulty === "mixed"
        ? "cover all kind of difficulty types including miscellaneous"
        : difficulty
    }. 
    
    Format requirements for different question types:
    
    1. MCQ Format:
    {
      type: 'mcq',
      question: { 
        text: 'only question text (don’t include code snippet here)',
        code?: 'code block with proper indentation; the first line specifies the language (e.g., python, SQL, rust, etc.)'
      },
      options: [
        { text?: 'option text', code?: 'formatted code if needed' },
        // ... more options
      ],
      answer: number // index of correct option
    }

    2. Fill in the blanks Format:
    {
      type: 'fill-in-blank',
      question: {
        text: 'question text with ___ for blanks',
        code?: 'formatted code if needed'
      },
      options: [
        { text?: 'option text'},
        // ... more options
      ],
      answer: number // index of correct option
    }

    3. Assertion Reason Format:
    {
      type: 'assertion-reason',
      question: {
        assertion: 'assertion statement',
        reason: 'reason statement',
        code?: 'formatted code if needed'
      },
      options: [
        'Both assertion and reason are true and reason is the correct explanation of assertion',
        'Both assertion and reason are true but reason is not the correct explanation of assertion',
        'Assertion is true but reason is false',
        'Assertion is false but reason is true'
      ],
      answer: number // index of correct option
    }
   
    4. True/False Format:
    {
      type: 't/f',
      question: {
        text: 'question statement',
        code?: 'formatted code if needed'
      },
      options: ['True', 'False'],
      answer: number // index of correct option
    }

    For mathematical expressions:
    - Use Unicode symbols (×, ÷, ≤, ≥, ≠, π, ∑, ∫, √) and also as many as possible.
    - Use Unicode superscripts (²,³) and subscripts (₁,₂) kind of notations where possible
    
    For code snippets:
    - Always include proper indentation
    - Use consistent formatting
    - Include language-specific syntax highlighting hints
    
    ${prompt ? "Additional instructions: " + prompt : ""}`;

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

    return NextResponse.json({ questions, topic: `${keyword} questions` });
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
}
