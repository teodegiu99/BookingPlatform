import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
// Importa auth per sicurezza aggiuntiva (opzionale ma consigliato)
import { auth } from '@/auth'; 

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    // Recupera l'appuntamento originale
    const appuntamento = await db.appuntamento.findUnique({
      where: { id: params.id },
    });

    if (!appuntamento) {
      return NextResponse.json({ error: 'Appuntamento non trovato' }, { status: 404 });
    }

    // LOGICA DI CANCELLAZIONE A CASCATA
    // Se l'utente che sta cancellando è l'owner dell'appuntamento (chi l'ha creato)
    // OPPURE se l'appuntamento stesso è il record "Principale" (ownerId == commercialeId)
    // Allora cancelliamo tutto il gruppo.
    
    // Verifica se è il record principale (quello sul calendario del creatore)
    const isMainRecord = appuntamento.commercialeId === appuntamento.ownerId;
    
    // Verifica se chi cancella è il proprietario (utile per sicurezza)
    const isDeleterOwner = session?.user?.id === appuntamento.ownerId;

    if (isMainRecord || isDeleterOwner) {
      // Cancella TUTTI gli appuntamenti che fanno parte dello stesso "evento":
      // Stesso creatore (ownerId), stessi orari, stesso cliente.
      const deletedBatch = await db.appuntamento.deleteMany({
        where: {
          ownerId: appuntamento.ownerId, // Creato dalla stessa persona
          clienteId: appuntamento.clienteId, // Per lo stesso cliente
          // Usiamo 'hasEvery' o 'equals' per gli array. 
          // Dato che sono creati identici, 'equals' va bene, ma per sicurezza filtriamo per il primo orario start
          orario: {
             equals: appuntamento.orario 
          }
        },
      });

      console.log(`Cancellati ${deletedBatch.count} appuntamenti a cascata.`);
      return NextResponse.json({ success: true, cascata: true, count: deletedBatch.count });
    }

    // Caso fallback: Cancella solo questo specifico record 
    // (es. se un amministratore cancella un singolo slot o una logica futura diversa)
    await db.appuntamento.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, cascata: false });
  } catch (error) {
    console.error('Errore nella cancellazione:', error);
    return NextResponse.json({ error: 'Errore nel server' }, { status: 500 });
  }
}