'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  commercialeId: string;
  selectedDate: Date;
  startHour: string;
};

export const CreaAppuntamentoModal: React.FC<Props> = ({
  open,
  onClose,
  commercialeId,
  selectedDate,
  startHour,
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

      toast.success('Appuntamento creato');
      onClose();
    } catch (err) {
      toast.error('Errore nella creazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose} >
      <DialogContent className='bg-neutral'>
        <DialogHeader>
          <DialogTitle>Nuovo Appuntamento</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Label>Nome</Label>
          <Input name="nome" value={form.nome} onChange={handleChange} />

          <Label>Cognome</Label>
          <Input name="cognome" value={form.cognome} onChange={handleChange} />

          <Label>Azienda</Label>
          <Input name="azienda" value={form.azienda} onChange={handleChange} />

          <Label>Ruolo</Label>
          <Input name="ruolo" value={form.ruolo} onChange={handleChange} />

          <Label>Email</Label>
          <Input name="email" value={form.email} onChange={handleChange} type="email" />

          <Label>Telefono</Label>
          <Input name="telefono" value={form.telefono} onChange={handleChange} />

          <Label>Durata (minuti)</Label>
          <Input
            type="number"
            name="durata"
            value={form.durata}
            onChange={handleDurataChange}
            min={30}
            step={30}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Annulla
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvataggio...' : 'Salva'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
