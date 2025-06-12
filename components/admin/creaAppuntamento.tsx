'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { toast } from 'sonner';
import { User } from '@prisma/client';

type UserOption = {
  value: string;
  label: string;
};

type Appuntamento = {
  orario: string[];
  commerciale: {
    id: string;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  commercialeId: string;
  selectedDate: string; // formato YYYY-MM-DD
  startHour: string; // formato HH:mm
  appuntamenti: Appuntamento[];
};

export const CreaAppuntamentoModal: React.FC<Props> = ({
  open,
  onClose,
  commercialeId,
  selectedDate,
  startHour,
  appuntamenti,
}) => {
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [azienda, setAzienda] = useState('');
  const [ruolo, setRuolo] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [note, setNote] = useState('');
  const [durata, setDurata] = useState(30);
  const [invitatiOptions, setInvitatiOptions] = useState<UserOption[]>([]);
  const [selectedInvitati, setSelectedInvitati] = useState<UserOption[]>([]);
  const [errore, setErrore] = useState<string | null>(null);

  if (!open) return null;

  useEffect(() => {
    const fetchCommerciali = async () => {
      const res = await fetch('/api/commerciali');
      const data = await res.json();
      const options = data
        .filter((u: User) => u.id !== commercialeId)
        .map((u: User) => ({
          value: u.id,
          label: `${u.name ?? ''} ${u.cognome ?? ''} (${u.email})`,
        }));
      setInvitatiOptions(options);
    };

    if (open) fetchCommerciali();
  }, [open, commercialeId]);

  const isSlotOccupied = (userId: string, slotTime: number) => {
    return appuntamenti.some(
      (a) =>
        a.commerciale.id === userId &&
        a.orario.some((o) => new Date(o).getTime() === slotTime)
    );
  };

  const addNextSlot = () => {
    const start = new Date(`${selectedDate}T${startHour}`);
    const nextSlot = new Date(start);
    nextSlot.setMinutes(nextSlot.getMinutes() + durata);
    const nextSlotTime = nextSlot.getTime();

    if (isSlotOccupied(commercialeId, nextSlotTime)) {
      toast.warning('Il prossimo slot non è disponibile.');
    } else {
      toast.info('Slot aggiunto.');
      setDurata((prev) => prev + 30);
    }
  };

  const handleSubmit = async () => {
    const start = new Date(`${selectedDate}T${startHour}`);
    const slots: string[] = [];
    const slotCount = durata / 30;
    for (let i = 0; i < slotCount; i++) {
      const slot = new Date(start);
      slot.setMinutes(slot.getMinutes() + i * 30);
      slots.push(slot.toISOString());
    }

    try {
      const res = await fetch('/api/appuntamenti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: { nome, cognome, azienda, ruolo, email, telefono },
          orario: slots,
          commercialeId,
          note,
          invitati: selectedInvitati.map((i) => i.value),
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setErrore(result.error || 'Errore nella creazione dell’appuntamento.');
        return;
      }

      toast.success('Appuntamento creato con successo.');
      setErrore(null);
      onClose();
    } catch (err: any) {
      setErrore(err.message || 'Si è verificato un errore.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4 relative">
        <h2 className="text-xl font-semibold text-center">Nuovo Appuntamento</h2>

        {errore && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            <strong className="font-bold">Errore:</strong> {errore}
            <button
              onClick={() => setErrore(null)}
              className="absolute top-1 right-2 text-red-700 text-xl font-bold"
              aria-label="Chiudi"
            >
              ×
            </button>
          </div>
        )}

        <input className="w-full border p-2 rounded" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Azienda" value={azienda} onChange={(e) => setAzienda(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Ruolo" value={ruolo} onChange={(e) => setRuolo(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <label className="block text-sm font-medium text-gray-700">Invita altri commerciali</label>
        <Select
          isMulti
          options={invitatiOptions}
          value={selectedInvitati}
          onChange={(val) => setSelectedInvitati(val as UserOption[])}
        />

        <textarea
          className="w-full border p-2 rounded"
          placeholder="Note (opzionale)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label>Durata (min):</label>
          <input
            className="border rounded p-1 w-20"
            type="number"
            value={durata}
            min={30}
            step={30}
            onChange={(e) => setDurata(parseInt(e.target.value))}
          />
          <button onClick={addNextSlot} className="px-3 py-1 bg-primary text-white rounded">
            Aggiungi slot
          </button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button className="px-4 py-2 rounded border" onClick={onClose}>
            Annulla
          </button>
          <button className="px-4 py-2 rounded bg-primary text-white" onClick={handleSubmit}>
            Crea
          </button>
        </div>
      </div>
    </div>
  );
};
