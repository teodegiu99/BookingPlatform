import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function POST(req: Request) {
  const body = await req.json();
  const { userId, color } = body;

  if (!userId || !color) {
    return NextResponse.json({ error: 'Missing data' }, { status: 400 });
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { color: color },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}
