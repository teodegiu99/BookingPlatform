'use client';
import { useTranslation } from "@/lib/useTranslation";

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { User } from '@prisma/client';

// Aggiungo 'multipleAppointment' al tipo User per TypeScript
type AppUser = User & {
  multipleAppointment?: boolean;
};


const ConfermaClienteModal = ({ cliente, onConfirm, onCancel }: any) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">{t('cliente_gia_in_anagrafica')}</h2>
        <p>{t('esiste_gia_un_cliente_con_questa_email')}</p>
        <div className="mt-4 text-sm text-gray-700 space-y-1">
          <div><strong>{t('nome')}:</strong> {cliente.nome}</div>
          <div><strong>{t('cognome')}:</strong> {cliente.cognome}</div>
          <div><strong>{t('azienda')}:</strong> {cliente.azienda}</div>
          <div><strong>'email':</strong> {cliente.email}</div>
          <div><strong>{t('telefono')}:</strong> {cliente.numero}</div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="px-4 py-2 border rounded" onClick={onCancel}>{t('annulla')}</button>
          <button className="px-4 py-2 bg-primary text-white rounded" onClick={onConfirm}>{t('conferma')}</button>
        </div>
      </div>
    </div>
  );
};

type UserOption = {
  value: string;
  label: string;
};

// Ho aggiunto 'invitati' al tipo, assumendo che la prop 'appuntamenti' lo contenga
type Appuntamento = {
  orario: string[];
  commerciale: {
    id: string;
  };
  invitati?: string[]; // Aggiunto per il controllo conflitti
};

type Props = {
  open: boolean;
  onClose: () => void;
  commercialeId: string;
  selectedDate: string; // formato YYYY-MM-DD
  startHour: string; // formato HH:mm
  appuntamenti: Appuntamento[]; // Questa prop deve includere gli 'invitati'
};

export const CreaAppuntamentoModal: React.FC<Props> = ({
  open,
  onClose,
  commercialeId,
  selectedDate,
  startHour,
  appuntamenti,
}) => {
  // --- (FIX) RIPRISTINO STATI MANCANTI ---
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [azienda, setAzienda] = useState('');
  const [ruolo, setRuolo] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setnumero] = useState('');
  const [note, setNote] = useState('');
  const [durata, setDurata] = useState(30);
  const [invitatiOptions, setInvitatiOptions] = useState<UserOption[]>([]);
  const [selectedInvitati, setSelectedInvitati] = useState<UserOption[]>([]);
  const [errore, setErrore] = useState<string | null>(null);
  const [clienteEsistente, setClienteEsistente] = useState<any>(null);
  // --- Fine Fix ---
  
  // Stato per memorizzare TUTTI i commerciali con i loro dati
  const [allCommerciali, setAllCommerciali] = useState<AppUser[]>([]);
  const { t } = useTranslation();

  if (!open) return null;

  useEffect(() => {
    const fetchCommerciali = async () => {
      try {
        const res = await fetch('/api/commerciali');
        if (!res.ok) throw new Error('Failed to fetch commerciali');
        const data: AppUser[] = await res.json();
        
        setAllCommerciali(data); // Memorizza tutti i commerciali
        
        const options = data
          .filter((u: AppUser) => u.id !== commercialeId) // Filtra l'utente principale
          .map((u: AppUser) => ({
            value: u.id,
            label: `${u.name ?? ''} ${u.cognome ?? ''} (${u.email ?? ''})`,
          }));
        setInvitatiOptions(options);
      } catch (err) {
        console.error(err);
        // toast.error(t('errore_caricamento_commerciali'));
      }
    };

    if (open) fetchCommerciali();
  }, [open, commercialeId, t]);

  // Logica isSlotOccupied aggiornata per controllare anche gli invitati
  const isSlotOccupied = (userId: string, slotTime: number) => {
    return appuntamenti.some((a) => {
      // Controlla se l'utente è il commerciale principale di questo appuntamento
      const isMain = a.commerciale.id === userId;
      
      // Controlla se l'utente è tra gli invitati di questo appuntamento
      const isInvited = a.invitati ? a.invitati.includes(userId) : false;
      
      // Controlla se l'appuntamento è in questo slot orario
      const timeMatch = a.orario.some((o) => new Date(o).getTime() === slotTime);
      
      // È occupato se è il principale O un invitato E l'orario coincide
      return (isMain || isInvited) && timeMatch;
    });
  };

  // Logica 'addNextSlot' aggiornata
  const addNextSlot = () => {
    const start = new Date(`${selectedDate}T${startHour}`);
    const nextSlot = new Date(start);
    nextSlot.setMinutes(nextSlot.getMinutes() + durata);
    const nextSlotTime = nextSlot.getTime();

    // 1. Trova il commerciale principale
    const mainCommerciale = allCommerciali.find(c => c.id === commercialeId);

    // 2. Trova i commerciali invitati
    const invitedCommerciali = selectedInvitati.map(inv => 
      allCommerciali.find(c => c.id === inv.value)
    ).filter(Boolean) as AppUser[]; // Filtra eventuali 'undefined'

    const allParticipants = [mainCommerciale, ...invitedCommerciali].filter(Boolean) as AppUser[];

    // 3. Controlla la disponibilità di tutti
    for (const com of allParticipants) {
      // Se il commerciale NON può avere appuntamenti multipli...
      if (com && com.multipleAppointment !== true) { // Aggiunto check 'com' per sicurezza
        // ...controlla se lo slot è occupato (usando la NUOVA logica isSlotOccupied)
        if (isSlotOccupied(com.id, nextSlotTime)) {
          // Se è occupato, mostra l'avviso e interrompi
          const nomeCom = com.name || com.email;
          // toast.warning(`${t('proxslotnodisp_per')} ${nomeCom}`);
          return; // Interrompi la funzione
        }
      }
      // Se 'multipleAppointment' è true, ignora il controllo e continua il loop
    }

    // 4. Se tutti i controlli (per chi non è 'multi') sono passati, aggiungi lo slot
    // toast.info(t('Slot_aggiunto'));
    setDurata((prev) => prev + 30);
  };


  const submitDati = async (force = false) => {
    const start = new Date(`${selectedDate}T${startHour}`);
    const slots: string[] = [];
    const slotCount = durata / 30;
    for (let i = 0; i < slotCount; i++) {
      const slot = new Date(start);
      slot.setMinutes(slot.getMinutes() + i * 30);
      slots.push(slot.toISOString());
    }
  
    const res = await fetch('/api/appuntamenti', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cliente: { nome, cognome, azienda, ruolo, email, numero },
        orario: slots,
        commercialeId,
        note,
        invitati: selectedInvitati.map((i) => i.value),
        force,
      }),
    });
  
    const result = await res.json();
  
    console.log('Response from API:', result);
  
    if (result.conflict) {
      setClienteEsistente(result.clienteEsistente);
      return;
    }
  
    if (!res.ok) {
      setErrore(result.error || t('apperr'));
      return;
    }
  
    toast.success(t('appsucc'));
    setErrore(null);
    onClose();
  };
  


  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4 relative">
        <h2 className="text-xl font-semibold text-center">{t('nuovoappuntamento')}</h2>

        {errore && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            <strong className="font-bold">{t('error')}:</strong> {errore}
            <button onClick={() => setErrore(null)} className="absolute top-1 right-2 text-red-700 text-xl font-bold" aria-label="Chiudi">×</button>
          </div>
        )}

{clienteEsistente && (
  <ConfermaClienteModal
    cliente={clienteEsistente}
    onConfirm={() => {
      setClienteEsistente(null);
      submitDati(true);
    }}
    onCancel={() => setClienteEsistente(null)}
  />
)}
        {/* I campi ora funzionano perché gli stati sono definiti */}
        <input className="w-full border p-2 rounded" placeholder={t('nome')} value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder={t('cognome')} value={cognome} onChange={(e) => setCognome(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder={t('azienda')} value={azienda} onChange={(e) => setAzienda(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder={t('ruolo')} value={ruolo} onChange={(e) => setRuolo(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder={t('telefono')} value={numero} onChange={(e) => setnumero(e.target.value)} />

        <label className="block text-sm font-medium text-gray-700">{t('Invita_altri_commerciali')}</label>
        <Select
          isMulti
          options={invitatiOptions}
          value={selectedInvitati}
          onChange={(val) => setSelectedInvitati(val as UserOption[])}
        />

        <textarea className="w-full border p-2 rounded" placeholder="Note (opzionale)" value={note} onChange={(e) => setNote(e.target.value)} />

        <div className="flex items-center gap-2">
          <label>{t('durata')}:</label>
          <input className="border rounded p-1 w-20" type="number" value={durata} min={30} step={30} onChange={(e) => setDurata(parseInt(e.target.value))} />
          <button onClick={addNextSlot} className="px-3 py-1 bg-primary text-white rounded">{t('aggiungislot')}</button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button className="px-4 py-2 rounded border" onClick={onClose}>{t('annulla')}</button>
          <button className="px-4 py-2 rounded bg-primary text-white" onClick={() => submitDati(false)}>{t('crea')}</button>
        </div>
      </div>
    </div>
  );
};

