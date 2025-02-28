import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { quizId, answers } = await req.json();

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { attempts: { where: { userId: session.user.id } } },
    });

    if (!quiz) {
      return new NextResponse(JSON.stringify({ error: "Quiz not found" }), {
        status: 404,
      });
    }

    if (quiz.attempts[0]?.submittedAt) {
      return new NextResponse(
        JSON.stringify({ error: "Quiz already submitted" }),
        { status: 403 }
      );
    }
    console.log("here 1");

    // Calculate score
    const questions = JSON.parse(JSON.stringify(quiz.questions));
    let correctAnswers = 0;
    console.log("here 2");

    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      if (questions[parseInt(questionIndex)].answer === answerIndex) {
        correctAnswers++;
      }
    });

    const score = correctAnswers * quiz.marksPerQuestion;
    console.log("here 3");
    // Update attempt

    await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId: quiz.id,
        score,
        answers,
        submittedAt: new Date(),
      },
    });

    console.log("here 4");

    return new NextResponse(
      JSON.stringify({ message: "Quiz submitted successfully" })
    );
  } catch (error) {
    // console.error( error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
