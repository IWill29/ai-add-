import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true }
        }
      }
    });
    return NextResponse.json(chats);
  } catch (error) {
    console.error('Database error [GET /api/chats]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title } = body;

    const chat = await prisma.chat.create({
      data: {
        title: title || 'Jauns čats',
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Database error [POST /api/chats]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
