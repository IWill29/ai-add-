import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (chatId) {
      await prisma.message.deleteMany({
        where: { chatId }
      });
    } else {
      await prisma.message.deleteMany();
    }
    
    return NextResponse.json({ message: 'History cleared' });
  } catch (error) {
    console.error('Database error [DELETE]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
