import { auth } from '@/auth'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json([], { status: 401 })
  }

  const appuntamenti = await db.appuntamento.findMany({
    where: { commercialeId: userId },
    include: { cliente: true },
  })

  return NextResponse.json(appuntamenti)
}
