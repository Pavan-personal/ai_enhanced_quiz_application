import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    console.log('here')
    const session = await getSession();
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { duration, scheduledFor, marksPerQuestion, questions } = body;
    console.log('here')

    if (!duration || !scheduledFor || !marksPerQuestion || !questions?.length) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title: `Quiz ${new Date(scheduledFor).toLocaleDateString()}`,
        duration,
        scheduledFor,
        marksPerQuestion,
        questions,
        userId: session.user.id,
      },
    });
    console.log('here')

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
