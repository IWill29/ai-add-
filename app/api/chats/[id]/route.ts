import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.chat.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Chat deleted' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }
    }
    console.error('Database error [DELETE /api/chats/[id]]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title } = body;

    const chat = await prisma.chat.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json(chat);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
      }
    }
    console.error('Database error [PATCH /api/chats/[id]]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
