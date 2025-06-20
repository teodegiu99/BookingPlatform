import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { ids } = await req.json();

  if (!Array.isArray(ids)) {
    return NextResponse.json({ error: 'Invalid IDs' }, { status: 400 });
  }

  const users = await db.user.findMany({
    where: { id: { in: ids } },
    select: { email: true },
  });

  const emails = users.map(u => u.email).filter(Boolean);

  return NextResponse.json({ emails });
}
