// app/api/getCommerciale/route.ts
import { auth } from '@/auth'
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const commerciale = await db.user.findUnique({
    where: { email: session.user.email },
    select: { name: true, cognome: true },
  });

  return NextResponse.json(commerciale);
}
