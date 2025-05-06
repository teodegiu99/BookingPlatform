'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTranslation } from "@/lib/useTranslation";

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
  selectedDate: Date;
  startHour: string;
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
  
  const [form, setForm] = useState({
    nome: '',
    cognome: '',
    azienda: '',
    ruolo: '',
    email: '',
    telefono: '',
    durata: 30, // minuti
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDurataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, durata: parseInt(e.target.value, 10) }));
  };
  const { t } = useTranslation();

  const isSlotOccupied = (commercialeId: string, slotTime: number) => {
    if (!appuntamenti || appuntamenti.length === 0) return false; // Se non ci sono appuntamenti, ritorna false
    return appuntamenti.some((a) =>
      a.commerciale.id === commercialeId &&
      a.orario.some((o) => new Date(o).getTime() === slotTime)
    );
  };
  

  
  const addNextSlot = () => {
    const start = new Date(selectedDate);
    const [hour, minute] = startHour.split(':').map(Number);
    start.setHours(hour, minute, 0, 0);
  
    const currentDuration = form.durata;
    const nextSlot = new Date(start);
    nextSlot.setMinutes(nextSlot.getMinutes() + currentDuration);
  
    // Normalizza il nextSlot per il confronto (rimuove secondi e millisecondi)
    const normalizedNextSlot = new Date(nextSlot);
    normalizedNextSlot.setSeconds(0, 0);
    let normalizedNextSlotTime = normalizedNextSlot.getTime();
  
    // Verifica se il prossimo slot è occupato
    if (isSlotOccupied(commercialeId, normalizedNextSlotTime)) {
      toast.warning(t('proxslotnodisp'));
    } else {
      // Se non è occupato, aggiungi 30 minuti e aggiorna la durata
      toast.info(t('proxslotadd'));
      setForm((prev) => ({
        ...prev,
        durata: prev.durata + 30, // Aggiungi 30 minuti
      }));
    }
  };
  

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const start = new Date(selectedDate);
      const [hour, minute] = startHour.split(':').map(Number);
      start.setHours(hour, minute, 0, 0);
  
      const slots: string[] = [];
      const slotCount = form.durata / 30;
      for (let i = 0; i < slotCount; i++) {
        const slot = new Date(start);
        slot.setMinutes(slot.getMinutes() + i * 30);
        slots.push(slot.toISOString());
      }
  
      console.log('Dati da inviare:', {
        cliente: {
          nome: form.nome,
          cognome: form.cognome,
          azienda: form.azienda,
          ruolo: form.ruolo,
          email: form.email,
          telefono: form.telefono,
        },
        orario: slots,
        commercialeId,
      });
  
      const res = await fetch('/api/appuntamenti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cliente: {
            nome: form.nome,
            cognome: form.cognome,
            azienda: form.azienda,
            ruolo: form.ruolo,
            email: form.email,
            telefono: form.telefono,
          },
          orario: slots,
          commercialeId,
        }),
      });
  
      if (!res.ok) throw new Error('Errore nel salvataggio');
  
      toast.success(t('appsucc'));

await fetch('/api/sendMail', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: form.email,
    subject: 'Conferma appuntamento test',
    html: `
      <p>Ciao ${form.nome},</p>
      <p>il tuo appuntamento è stato confermato per il giorno <strong>${selectedDate.toLocaleDateString()}</strong> alle <strong>${startHour}</strong> con durata di <strong>${form.durata} minuti</strong>.</p>
      <p>Grazie,<br/></p>
    `,
  }),
});
      onClose();
    } catch (err) {
      toast.error('Errore nella creazione');
      console.error(err); // Aggiungi un log per catturare l'errore
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className='bg-neutral'>
        <DialogHeader>
          <DialogTitle>{t('nuovoappuntamento')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>{t('nome')}</Label>
          <Input name="nome" value={form.nome} onChange={handleChange} />

          <Label>{t('cognome')}</Label>
          <Input name="cognome" value={form.cognome} onChange={handleChange} />

          <Label>{t('azienda')} *</Label>
          <Input name="azienda" value={form.azienda} onChange={handleChange} />

          <Label>{t('ruolo')}</Label>
          <Input name="ruolo" value={form.ruolo} onChange={handleChange} />

          <Label>Email *</Label>
          <Input name="email" value={form.email} onChange={handleChange} type="email" />

          <Label>{t('telefono')}</Label>
          <Input name="telefono" value={form.telefono} onChange={handleChange} />

          <Label>{t('durata')} (minuti)</Label>
               <button
                onClick={addNextSlot}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
              >
                {t('aggiungislot')}
              </button>
          <Input
            type="number"
            name={t('durata')}
            value={form.durata}
            onChange={handleDurataChange}
            min={30}
            step={30}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
          {t('annulla')}
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? t('salv') : t('salva')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
