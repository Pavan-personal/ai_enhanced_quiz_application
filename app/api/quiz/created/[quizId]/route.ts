import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Find the quiz to get total marks
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: params.quizId,
      },
      select: {
        questions: true,
        marksPerQuestion: true,
        title: true,
      },
    });

    if (!quiz) {
      return new NextResponse(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    // Calculate total possible marks
    const questionsArray = quiz.questions as any[];
    const totalPossibleMarks = questionsArray.length * quiz.marksPerQuestion;

    // Get all attempts for this quiz with user information
    const attempts = await prisma.quizAttempt.findMany({
      where: {
        quizId: params.quizId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    // Format the response
    const formattedAttempts = attempts.map((attempt) => ({
      attemptId: attempt.id,
      user: {
        id: attempt.user.id,
        name: attempt.user.name,
        email: attempt.user.email,
        image: attempt.user.image,
      },
      score: attempt.score,
      totalMarks: totalPossibleMarks,
      startedAt: attempt.startedAt,
      submittedAt: attempt.submittedAt,
      completed: !!attempt.submittedAt,
    }));

    return NextResponse.json({
      quizTitle: quiz.title,
      totalAttempts: attempts.length,
      attempts: formattedAttempts,
    });
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}