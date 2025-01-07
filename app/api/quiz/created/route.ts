import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
      const session = await getSession();
  
      if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const quizzes = await prisma.quiz.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          _count: {
            select: {
              attempts: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
  
      const formattedQuizzes = quizzes.map((quiz) => ({
        ...quiz,
        attempts: quiz._count.attempts,
      }));
  
      return NextResponse.json(formattedQuizzes);
    } catch (error) {
      console.error('Error fetching created quizzes:', error);
      return new NextResponse('Internal error', { status: 500 });
    }
  }