import { prisma } from "@/lib/prisma";
import { getSession } from "next-auth/react";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
      const session = await getSession();
  
      if (!session?.user) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
  
      const body = await req.json();
      const { title, description, duration, scheduledFor, marksPerQuestion, questions } = body;
  
      if (!title || !duration || !scheduledFor || !marksPerQuestion || !questions?.length) {
        return new NextResponse('Missing required fields', { status: 400 });
      }
  
      // Check if user is on free plan and has reached quiz limit
      const quizCount = await prisma.quiz.count({
        where: {
          userId: session.user.id,
        },
      });
  
      if (quizCount >= 5) {
        return new NextResponse('Free plan limit reached. Please upgrade to create more quizzes.', { status: 403 });
      }
  
      const quiz = await prisma.quiz.create({
        data: {
          title,
          description,
          duration,
          scheduledFor,
          marksPerQuestion,
          questions,
          userId: session.user.id,
        },
      });
  
      return NextResponse.json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      return new NextResponse('Internal error', { status: 500 });
    }
  }