

'use client';

import React, { useRef, useState, useEffect } from 'react';
import Select from 'react-select';
import { useDate } from '@/context/DateContext';
import { createAppuntamento } from '@/actions/createAppuntamento';
import { getAvailableSlotsByDay } from '@/actions/getSlotLiberi';
import { useSession } from 'next-auth/react';
import { getAppuntamentiByDayAndCommerciale } from '@/actions/getSlotPrenotati';
import { FiTrash2 } from 'react-icons/fi';
import { deleteAppuntamento } from '@/actions/deleteSlot';
import useSWR from 'swr';
import { useTranslation } from '@/lib/useTranslation';

type UserOption = { value: string; label: string };

type Commerciale = {
  id: string;
  name: string;
  cognome: string;
  email: string;
};

export const dynamic = 'force-dynamic';

const TimeSlotList = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { selectedDate } = useDate();
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitatiOptions, setInvitatiOptions] = useState<UserOption[]>([]);
  const [selectedInvitati, setSelectedInvitati] = useState<UserOption[]>([]);
  const [selectedAppuntamento, setSelectedAppuntamento] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [commerciale, setCommerciale] = useState<Commerciale | null>(null);
    const fetchSlotsData = async () => {
    const formattedDate = selectedDate.toLocaleDateString('it-IT');
    const available = await getAvailableSlotsByDay(formattedDate, userId);
    const allApp = await getAppuntamentiByDayAndCommerciale(userId, selectedDate);
    const booked = allApp.filter((app) =>
      app.orari.some((str: string) => new Date(str).toLocaleDateString('it-IT') === formattedDate)
    );
    return {
      slots: available.map((s: any) => new Date(s)),
      booked,
    };
  };

  const { data, mutate } = useSWR(userId ? ['slots', selectedDate.toISOString(), userId] : null, fetchSlotsData);
  const slots = data?.slots ?? [];
  const booked = data?.booked ?? [];

  useEffect(() => {
    if (isModalOpen) {
      fetch('/api/commerciali')
        .then((r) => r.json())
        .then((data: any[]) => {
          const opts = data
            .filter((u) => u.id !== userId)
            .map((u) => ({ value: u.id, label: `${u.name} ${u.cognome} (${u.email})` }));
          setInvitatiOptions(opts);
        });
    }
  }, [isModalOpen, userId]);

  const openModal = (slot: Date) => {
    setSelectedSlots([slot]);
    setSelectedInvitati([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlots([]);
  };

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((data) => setCommerciale(data));
    console.log(commerciale);
  }, []);

  const addNextSlot = () => {
    if (selectedSlots.length === 0) return;
    const last = selectedSlots[selectedSlots.length - 1];
    const idx = slots.findIndex((s) => s.getTime() === last.getTime());
    if (idx >= 0 && idx < slots.length - 1) {
      const next = slots[idx + 1];
      const expected = new Date(last);
      expected.setMinutes(expected.getMinutes() + 30);
      if (next.getTime() === expected.getTime()) {
        setSelectedSlots((prev) => [...prev, next]);
      }
    }
  };

  const getTimeRangeFromAppuntamento = (app: any) => {
    if (!app.orari || app.orari.length === 0) return '';
    const start = new Date(app.orari[0]);
    const end = new Date(app.orari[app.orari.length - 1]);
    end.setMinutes(end.getMinutes() + 30);
    return `${start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  };


  const formatTimeRange = () => {
    if (selectedSlots.length === 0) return '';
    const start = selectedSlots[0];
    const end = new Date(selectedSlots[selectedSlots.length - 1]);
    end.setMinutes(end.getMinutes() + 30);
    return `${start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - ${end
      .toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const res = await createAppuntamento({
      nome: formData.get('nome') as string,
      cognome: formData.get('cognome') as string,
      azienda: formData.get('azienda') as string,
      ruolo: formData.get('ruolo') as string,
      email: formData.get('email') as string,
      note: formData.get('note') as string,
      numero: formData.get('telefono') as string,
      orari: selectedSlots,
      invitatiIds: selectedInvitati.map((i) => i.value),
    });

  

    if (!res.success) {
      setToast({ message: res.message ?? 'Errore sconosciuto', type: 'error' });
      return;
    }
    

    formRef.current?.reset();
    setToast({ message: t('appsucc'), type: 'success' });
    closeModal();
    mutate();
  };

const user = session?.user.role;



  const handleSlotClick = (slot: Date) => openModal(slot);

  const handleBookedClick = (app: any) => setSelectedAppuntamento(app);

  const handleDeleteAppuntamento = async () => {
    if (!selectedAppuntamento) return;
    if (!confirm(t('confdel'))) return;

    const res = await deleteAppuntamento(selectedAppuntamento.id);
    if (res.success) {
      setSelectedAppuntamento(null);
      mutate();
    } else {
      setToast({ message: t('errdel'), type: 'error' });
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);


  const handleSendMail = async () => {
    if (!selectedAppuntamento) return;
  
    const destinatari = [
      selectedAppuntamento.cliente.email,
      ...(selectedAppuntamento.invitati?.map((i: any) => i.email) ?? []),
      session?.user.email,
    ].filter(Boolean); // Rimuove eventuali `undefined` o `null`
    console.log(...(selectedAppuntamento.invitati?.map((i: any) => i.email) ?? []))
    console.log(selectedAppuntamento.invitati);
    console.log(destinatari);
    console.log(selectedAppuntamento);
    const timeRange = getTimeRangeFromAppuntamento(selectedAppuntamento);

    const res = await fetch('/api/sendMail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: destinatari,
        subject: 'ZEGNA BARUFFA LANE BORGOSESIA - Conferma Appuntamento / Appointment confirmation PITTI FILATI',
        html: `
             <h2>Appointment Confirmation</h2>

      <p>
        Dear ${selectedAppuntamento.cliente.nome ?? ''} ${selectedAppuntamento.cliente.cognome ?? ''},
      </p>
      
      <p>
        This is to confirm your appointment scheduled as follows:
      </p>
      
      <ul>
        <li><strong>Date:</strong>${selectedDate.toLocaleDateString()}</li>
        <li><strong>Time:</strong>${timeRange}</li>
        <li><strong>Representative:</strong> ${commerciale?.name || ''} ${commerciale?.cognome || ''}</li>
      </ul>
      
      
      
      <p>
        Best regards,<br/>
       ${commerciale?.name || ''} ${commerciale?.cognome || ''}<br/>
      </p>
      
      `,








          }),
    });
  
    const result = await res.json();
    if (result.success) {
      setToast({ message: 'Email inviata con successo', type: 'success' });
    } else {
      setToast({ message: 'Errore durante l\'invio dell\'email', type: 'error' });
    }
  };






  
  return (
    <div className="flex items-center justify-center grow">
      <div className="border p-10 rounded-xl shadow space-y-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('slotdisponibili')}</h2>
          <div className="flex flex-wrap gap-3">
            {slots.map((slot, i) => (
              <div
                key={i}
                onClick={() => handleSlotClick(slot)}
                className="cursor-pointer px-4 py-2 rounded border text-primary hover:bg-blue-200 shadow"
              >
                {slot.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">{t('slotoccupati')}</h2>
          <div className="flex flex-wrap gap-3">
            {booked.map((app: any) => {
              const start = new Date(app.orari[0]);
              const end = new Date(app.orari[app.orari.length - 1]);
              end.setMinutes(end.getMinutes() + 30);
              const timeRange = `${start.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - ${end
                .toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
              return (
                <div
                  key={app.id}
                  onClick={() => handleBookedClick(app)}
                  className="cursor-pointer px-4 py-2 rounded border bg-blue-100 shadow"
                >
                  {timeRange}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isModalOpen && selectedSlots.length > 0 && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-2">{t('slotsel')}</h3>
            <p className="mb-4">{formatTimeRange()}</p>
            <button onClick={addNextSlot} className="mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl">
              {t('aggiungislot')}
            </button>
            <form ref={formRef} onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
              <input name="nome" placeholder={t('nome')} className="border rounded p-2" />
              <input name="cognome" placeholder={t('cognome')} className="border rounded p-2" />
              <input name="telefono" placeholder={t('telefono')} className="border rounded p-2" />
              <input name="email" type="email" placeholder="Email *" required className="border rounded p-2" />
              <input name="azienda" placeholder={t('aziendaast')} required className="border rounded p-2" />
              <input name="ruolo" placeholder={t('ruolo')} className="border rounded p-2" />
              <textarea name="note" placeholder={t('note')} className="col-span-2 border rounded p-2" />
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">invitati</label>
                <Select
                  isMulti
                  options={invitatiOptions}
                  value={selectedInvitati}
                  onChange={(v) => setSelectedInvitati(v as UserOption[])}
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-xl">
                  {t('annulla')}
                </button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl">
                  {t('invia')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedAppuntamento && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">{t('dettapp')}</h3>
              <button onClick={handleDeleteAppuntamento} className="text-red-600 hover:text-red-800">
                <FiTrash2 />
              </button>
            </div>
            <ul className="mb-4 space-y-1">
              <li><strong>{t('nome')}:</strong> {selectedAppuntamento.cliente.nome}</li>
              <li><strong>Email:</strong> {selectedAppuntamento.cliente.email}</li>
              <li><strong>{t('azienda')}:</strong> {selectedAppuntamento.cliente.azienda}</li>
              <li><strong>{t('ruolo')}:</strong> {selectedAppuntamento.cliente.ruolo}</li>
              <li><strong>{t('telefono')}:</strong> {selectedAppuntamento.cliente.numero}</li>
              <li><strong>{t('orari')}:</strong> {selectedAppuntamento.orari.map((o: string) =>
                new Date(o).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
              ).join(', ')}</li>
              <li><strong>{t('note')}:</strong> {selectedAppuntamento.note}</li>
            </ul>
            <div className="flex justify-end gap-2">
    <button name="mail" onClick={handleSendMail} className="px-4 py-2 bg-primary text-white rounded-xl"> {t('inviaEmail')}
              </button>
              <button onClick={() => setSelectedAppuntamento(null)} className="px-4 py-2 bg-gray-300 rounded-xl">
                {t('chiudi')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default TimeSlotList;


