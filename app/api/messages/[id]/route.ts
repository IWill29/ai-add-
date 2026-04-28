import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const message = await prisma.message.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error('Database error [PATCH]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
