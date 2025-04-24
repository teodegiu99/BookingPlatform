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


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cliente, orario, commercialeId } = body;

    if (
      !cliente?.email ||
      !cliente?.azienda ||
      !commercialeId ||
      !Array.isArray(orario) ||
      orario.length === 0
    ) {
      return NextResponse.json({ error: 'Dati mancanti o invalidi' }, { status: 400 });
    }

  
      let Cliente = await db.cliente.create({
        data: {
          nome: cliente.nome,
          cognome: cliente.cognome,
          azienda: cliente.azienda,
          ruolo: cliente.ruolo,
          email: cliente.email,
          numero: cliente.telefono,
        },
      });
    

    // Crea l'appuntamento
    const appuntamento = await db.appuntamento.create({
      data: {
        orario,
        clienteId: Cliente.id,
        commercialeId,
      },
    });

    return NextResponse.json(appuntamento, { status: 201 });
  } catch (error) {
    console.error('Errore nella creazione dell\'appuntamento:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}