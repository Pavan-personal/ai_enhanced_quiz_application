// import { NextResponse } from "next/server";
// import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const session = await getSession();
//     if (!session?.user) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }

//     const quiz = await prisma.quiz.findUnique({
//       where: { id: params?.id },
//       select: {
//         id: true,
//         title: true,
//         duration: true,
//         questions: true,
//         marksPerQuestion: true,
//       },
//     });

//     if (!quiz) {
//       return new NextResponse("Quiz not found", { status: 404 });
//     }

//     return NextResponse.json(quiz);
//   } catch (error) {
//     console.error("Error fetching quiz:", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  req: Request,
  { params }: { params: { quizId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: params.quizId },
      include: { attempts: { where: { userId: session.user.id } } },
    });

    if (!quiz) {
      return new NextResponse(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    // Check if user has already attempted
    if (quiz.attempts.length > 0) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz already attempted" }),
        { status: 403 }
      );
    }

    // Check quiz schedule
    const now = new Date();
    const quizEndTime = new Date(
      quiz.scheduledFor.getTime() + quiz.duration * 60000
    );

    if (now < quiz.scheduledFor) {
      return new NextResponse(
        JSON.stringify({
          error: "Quiz has not started yet",
          startTime: quiz.scheduledFor,
        }),
        { status: 403 }
      );
    }

    if (now > quizEndTime) {
      return new NextResponse(JSON.stringify({ error: "Quiz has ended" }), {
        status: 403,
      });
    }

    // Create attempt record
    await prisma.quizAttempt.create({
      data: {
        quizId: quiz.id,
        userId: session.user.id,
        answers: {},
        score: 0,
      },
    });

    // Remove answers from questions before sending
    const sanitizedQuestions = JSON.parse(JSON.stringify(quiz.questions)).map(
      (q: any) => {
        delete q.answer;
        return q;
      }
    );

    return new NextResponse(
      JSON.stringify({
        ...quiz,
        questions: sanitizedQuestions,
      })
    );
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
