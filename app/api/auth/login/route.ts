import { NextResponse } from 'next/server';
import { checkAdmin } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const isValid = checkAdmin(username, password);

    if (isValid) {
      // In a real production app, we would set a session cookie or JWT here.
      // For this builder environment, we will return a success state.
      return NextResponse.json({ success: true, user: { username, role: 'admin' } });
    }

    return NextResponse.json({ error: 'Nepareizs lietotājvārds vai parole' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
