// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const {
//       command,
//       topics,
//       difficulty,
//       numQuestions,
//       questionTypes = "mcq",
//       prompt,
//     } = await req.json();

//     if (!command || !topics || !Array.isArray(topics)) {
//       return NextResponse.json(
//         {
//           error:
//             'Invalid request body: "command" and "topics" (array) are required.',
//         },
//         { status: 400 }
//       );
//     }

//     const topicsText = topics.join(", ");
//     const questionTypeText = ` in the format of ${questionTypes}. ${
//       questionTypes.includes("mcq") && questionTypes !== "mcq"
//         ? "mcqs should always be atleast 60-65% of the total questions and others shoud be random "
//         : null
//     }`;
//     const customCommand = `Generate ${numQuestions} questions${questionTypeText} for the topics ${topicsText} with a difficulty level of ${
//       difficulty === "mixed"
//         ? "cover all kind of difficluty types includeing miscellaneous"
//         : difficulty
//     }. Single correct answer Format is {type: 'mcq or fill-in-blank or assertion-reason t/f', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string']}. 
//     Fill in the Gap (Option-Based) Format is {type: 'string', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string']}. Assertion-Reasoning Format is {type: 'string', question: 'string', answer: 'index of correct option', options: ['string', 'string', 'string', 'string'], statment: 'string', reason: 'string'}. ${
//       prompt ? "additional instructions: " + prompt : null
//     }.`;
//     const contents = [{ parts: [{ text: customCommand }] }];

//     const API_KEY = process.env.GEMINI_API_KEY;
//     if (!API_KEY) {
//       return NextResponse.json(
//         {
//           error:
//             "API key is missing. Please configure GEMINI_API_KEY in your environment variables.",
//         },
//         { status: 500 }
//       );
//     }

//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ contents }),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       return NextResponse.json(
//         { error: "Error from Gemini API", details: errorData },
//         { status: response.status }
//       );
//     }
    
//     const data = await response.json();
//     const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

//     let questions;
//     try {
//       questions = JSON.parse(rawText?.replace(/```json|```/g, "").trim());
//     } catch (error: any) {
//       return NextResponse.json(
//         {
//           error: "Failed to parse Gemini response content.",
//           details: error.message,
//         },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ questions });
//   } catch (error: any) {
//     console.error("Error handling request:", error);
//     return NextResponse.json(
//       { error: "An unexpected error occurred.", details: error.message },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";

// Helper function to sanitize JSON strings
function sanitizeJsonString(str: string): string {
  return str
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t')
    .replace(/\f/g, '\\f')
    .replace(/\\/g, '\\\\')
    .replace(/\$/g, '\\$')
    .replace(/"/g, '\\"');
}

// Helper function to clean and parse Gemini response
function parseGeminiResponse(rawText: string) {
  try {
    // First, try to find JSON content within markdown code blocks
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonContent = jsonMatch ? jsonMatch[1] : rawText;

    // Clean the content
    const cleanedContent = jsonContent
      .replace(/```json|```/g, '')
      .trim()
      .replace(/\\n/g, ' ')
      .replace(/\s+/g, ' ');

    // Parse the JSON
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("First parsing attempt failed:", error);
    
    // Fallback: Try to find array content directly
    try {
      const arrayMatch = rawText.match(/\[\s*{[\s\S]*}\s*\]/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[0]);
      }
    } catch (error) {
      console.error("Second parsing attempt failed:", error);
    }
    
    throw new Error("Failed to parse response content");
  }
}

export async function POST(req: Request) {
  try {
    const {
      command,
      topics,
      difficulty,
      numQuestions,
      questionTypes = "mcq",
      wantImageBased = false,
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
    
    let questionTypeText = '';
    if (wantImageBased) {
      questionTypeText = `in a descriptive format that helps visualize the concept. Include detailed scenario-based questions that paint a mental picture.`;
    } else {
      questionTypeText = ` in the format of ${questionTypes}.`;
    }

    const customCommand = `Generate ${numQuestions} questions${questionTypeText} for the topics ${topicsText} with a difficulty level of ${
      difficulty === "mixed"
        ? "cover all kind of difficulty types including miscellaneous"
        : difficulty
    }. 
    
    IMPORTANT: Please ensure all mathematical expressions are properly escaped in the JSON response. Use Unicode symbols for mathematical operators and simple expressions. For complex mathematical expressions, use LaTeX notation with escaped characters.
    
    Format the response as a JSON array of objects with the following structure:
    {
      "type": "string (mcq or fill-in-blank or assertion-reason t/f)",
      "question": "string with properly unicode symbols",
      "answer": number (index of correct option),
      "options": ["string", "string", "string", "string"]
    }
    
    For mathematical expressions:
    - Use Unicode symbols where possible (×, ÷, ≤, ≥, ≠, π, ∑, ∫, √,  and as much as possible...)
    - Use simple Unicode superscripts (²,³) and subscripts (₁,₂) where possible
    
    ${prompt ? "additional instructions: " + prompt : ""}.`;

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

    if (!rawText) {
      return NextResponse.json(
        { error: "Empty response from Gemini API" },
        { status: 500 }
      );
    }

    let questions;
    try {
      questions = parseGeminiResponse(rawText);
      
      // Additional sanitization of questions
      questions = questions.map((q: any) => ({
        type: q.type,
        question: sanitizeJsonString(q.question),
        answer: Number(q.answer),
        options: q.options.map((opt: string) => sanitizeJsonString(opt))
      }));
    } catch (error: any) {
      console.error("Raw response:", rawText);
      console.error("Parsing error:", error);
      return NextResponse.json(
        {
          error: "Failed to parse Gemini response content.",
          details: error.message,
          rawResponse: rawText
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      questions,
      metadata: {
        isImageBased: wantImageBased,
        note: wantImageBased ? "Provided descriptive text-based alternatives for image-based questions" : null
      }
    });
  } catch (error: any) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred.", details: error.message },
      { status: 500 }
    );
  }
}