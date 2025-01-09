// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { command, description } = await req.json();

//     if (!command || !description) {
//       return NextResponse.json(
//         {
//           error:
//             'Invalid request body: "command" and "description" are required.',
//         },
//         { status: 400 }
//       );
//     }

//     const contents = [
//       {
//         parts: [
//           {
//             text: `${command} Description: ${description}.
            
//             Format requirements for different question types:
    
//             1. MCQ Format:
//             {
//               type: 'mcq',
//               question: { 
//                 text: 'only question text (don’t include code snippet here)',
//                 code?: 'code block with proper indentation; the first line specifies the language (e.g., python, SQL, rust, etc.)'
//               },
//               options: [
//                 { text?: 'option text', code?: 'formatted code if needed' },
//                 // ... more options
//               ],
//               answer: number // index of correct option
//             }

//             2. Fill in the blanks Format:
//             {
//               type: 'fill-in-blank',
//               question: {
//                 text: 'question text with ___ for blanks',
//                 code?: 'formatted code if needed'
//               },
//               options: [
//                 { text?: 'option text'},
//                 // ... more options
//               ],
//               answer: number // index of correct option
//             }

//             3. Assertion Reason Format:
//             {
//               type: 'assertion-reason',
//               question: {
//                 assertion: 'assertion statement',
//                 reason: 'reason statement',
//                 code?: 'formatted code if needed'
//               },
//               options: [
//                 'Both assertion and reason are true and reason is the correct explanation of assertion',
//                 'Both assertion and reason are true but reason is not the correct explanation of assertion',
//                 'Assertion is true but reason is false',
//                 'Assertion is false but reason is true'
//               ],
//               answer: number // index of correct option
//             }
   
//             4. True/False Format:
//             {
//               type: 't/f',
//               question: {
//                 text: 'question statement',
//                 code?: 'formatted code if needed'
//               },
//               options: ['True', 'False'],
//               answer: number // index of correct option
//             }

//             For mathematical expressions:
//             - Use Unicode symbols (×, ÷, ≤, ≥, ≠, π, ∑, ∫, √) and also as many as possible.
//             - Use Unicode superscripts (²,³) and subscripts (₁,₂) kind of notations where possible
            
//             For code snippets:
//             - Always include proper indentation
//             - Use consistent formatting
//             - Include language-specific syntax highlighting hints
//             also give me the title of the quiz like I'm uploading a pdf file right so by analyzing the content of the pdf file I can get the title of the quiz and send it in response.
//             `,
//           },
//         ],
//       },
//     ];

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
//     const cleanedText = rawText?.replace(/```json|```/g, "").trim();

//     let formattedJson;
//     try {
//       formattedJson = JSON.parse(cleanedText);
//     } catch (error: any) {
//       return NextResponse.json(
//         {
//           error: "Failed to parse Gemini response content.",
//           details: error.message,
//         },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ data: formattedJson });
//   } catch (error: any) {
//     console.error("Error handling request:", error);
//     return NextResponse.json(
//       { error: "An unexpected error occurred.", details: error.message },
//       { status: 500 }
//     );
//   }
// }


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
            text: `${command} Description: ${description}.
            
            Format requirements for different question types:
    
            1. MCQ Format:
            {
              type: 'mcq',
              question: { 
                text: 'only question text (don't include code snippet here)',
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

            Please analyze the content and provide a title for the quiz along with the questions in this format:
            {
              "title": "The title based on content",
              "questions": [ ... questions following above formats ... ]
            }

            For mathematical expressions:
            - Use Unicode symbols (×, ÷, ≤, ≥, ≠, π, ∑, ∫, √) and also as many as possible.
            - Use Unicode superscripts (²,³) and subscripts (₁,₂) kind of notations where possible
            
            For code snippets:
            - Always include proper indentation
            - Use consistent formatting
            - Include language-specific syntax highlighting hints
            `,
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