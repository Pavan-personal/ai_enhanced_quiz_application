import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
      const session = await getSession();
  
      if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const attempts = await prisma.quizAttempt.findMany({
        where: {
          userId: session.user.id,
        },
        select: {
          id: true,
          score: true,
          answers: true,
          submittedAt: true,   
          startedAt: true,    
          quiz: {
            select: {
              title: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc',
        },
      });
      return NextResponse.json(attempts.map(attempt => {
        return {
          ...attempt,
          totalMarks: attempt.answers ? Object.keys(attempt.answers).length : 0,
        }
      }));
    } catch (error) {
      console.error('Error fetching attempted quizzes:', error);
      return new NextResponse('Internal error', { status: 500 });
    }
  }