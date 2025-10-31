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

// --- (FIX 1) FUNZIONI HELPER PER CALENDARIO ---

/**
 * Formatta una data in formato iCalendar (UTC).
 * Es: 20251031T103000Z
 */
const formatIcsDate = (date: Date): string => {
  // (FIX) La funzione pad ora usa padStart e restituisce sempre string
  const pad = (n: number): string => n.toString().padStart(2, '0');
  
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  );
};

/**
 * Crea il contenuto di un file .ics.
 */
const createIcsContent = (
  uid: string,
  start: Date,
  end: Date,
  summary: string,
  description: string,
  location: string
): string => {
  const dtStamp = formatIcsDate(new Date()); // Data di creazione
  const dtStart = formatIcsDate(start);
  const dtEnd = formatIcsDate(end);

  // Sostituisce le interruzioni di riga HTML (<br/>) con \n per il file .ics
  const plainDescription = description
    .replace(/<br\s*\/?>/gi, '\\n')
    .replace(/<[^>]+>/g, ''); // Rimuove altro HTML

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZegnaBaruffa//Appuntamento//IT',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${plainDescription}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return icsLines.join('\r\n');
};

// --- FINE HELPER ---


export const dynamic = 'force-dynamic';

const TimeSlotList = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { selectedDate } = useDate();
  const [clienteEsistente, setClienteEsistente] = useState(false);
const [formValues, setFormValues] = useState<FormData | null>(null);
  const { data: session } = useSession();
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedSlots, setSelectedSlots] = useState<Date[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invitatiOptions, setInvitatiOptions] = useState<UserOption[]>([]);
  const [selectedInvitati, setSelectedInvitati] = useState<UserOption[]>([]);
  const [selectedAppuntamento, setSelectedAppuntamento] = useState<any | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [commerciale, setCommerciale] = useState<Commerciale | null>(null);
  const [invitatoda, setInvitatoda] = useState<{ nome: string; cognome: string } | null>(null);
  const [isSending, setIsSending] = useState(false); 

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

  useEffect(() => {
    const fetchOwner = async () => {
      if (!selectedAppuntamento) {
        setInvitatoda(null);
        return;
      }
  
      const { ownerId, commercialeId } = selectedAppuntamento;
  
      if (ownerId && ownerId !== userId) {
        try {
          const result = await getCommercialeById(ownerId);
          setInvitatoda(result);
        } catch (error) {
          console.error("Errore nel recupero del commerciale:", error);
          setInvitatoda(null);
        }
      } else {
        setInvitatoda(null);
      }
    };
  
    fetchOwner();
  }, [selectedAppuntamento, userId]); // Aggiunto userId alle dipendenze


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
    // console.log(commerciale); // Rimosso log ridondante
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

  const getCommercialeById = async (id: string) => {
    if (!id) return null; // Rimosso controllo 'id === selectedAppuntamento?.commercialeId'
  
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) throw new Error('Errore nel recupero del commerciale');
      const data = await res.json();
    // console.log(data); // Rimosso log
      return { nome: data.name, cognome: data.cognome };
    } catch (error) {
      console.error('Errore durante il recupero del commerciale:', error);
      return null;
    }
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
  
    const payload = {
      nome: formData.get('nome') as string,
      cognome: formData.get('cognome') as string,
      azienda: formData.get('azienda') as string,
      ruolo: formData.get('ruolo') as string,
      email: formData.get('email') as string,
      note: formData.get('note') as string,
      numero: formData.get('telefono') as string,
      orari: selectedSlots,
      invitatiIds: selectedInvitati.map((i) => i.value),
    };
  
    const res = await createAppuntamento({ ...payload });
  
    if (res.clienteEsistente && !res.success) {
      // Mostra conferma utente
      setClienteEsistente(true);
      setFormValues(formData);
      return;
    }
  
    if (!res.success) {
      setToast({ message: res.message ?? 'Errore sconosciuto', type: 'error' });
      return;
    }
  
    formRef.current?.reset();
    setToast({ message: t('appsucc'), type: 'success' });
    closeModal();
    mutate();
  };
  
  const confermaSovrascrittura = async () => {
    if (!formValues) return;
  
    const payload = {
      nome: formValues.get('nome') as string,
      cognome: formValues.get('cognome') as string,
      azienda: formValues.get('azienda') as string,
      ruolo: formValues.get('ruolo') as string,
      email: formValues.get('email') as string,
      note: formValues.get('note') as string,
      numero: formValues.get('telefono') as string,
      orari: selectedSlots,
      invitatiIds: selectedInvitati.map((i) => i.value),
      force: true,
    };
  
    const res = await createAppuntamento(payload);
  
    if (!res.success) {
      setToast({ message: res.message ?? 'Errore durante la creazione', type: 'error' });
      setClienteEsistente(false);
      return;
    }
  
    setToast({ message: t('appsucc'), type: 'success' });
    setClienteEsistente(false);
    setFormValues(null);
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


  // --- (FIX 2) LOGICA DI INVIO EMAIL SEPARATA CON CALENDARI ---
  const handleSendMail = async () => {
    if (!selectedAppuntamento) return;

    const { cliente } = selectedAppuntamento;

    if (!cliente.email) {
      setToast({ message: t('emailNonDisponibile'), type: 'error' });
      return;
    }

    setIsSending(true);

    try {
      const timeRange = getTimeRangeFromAppuntamento(selectedAppuntamento);
      const formattedDate = selectedDate.toLocaleDateString('it-IT');

      // Definisci le date di inizio e fine per .ics
      const startDate = new Date(selectedAppuntamento.orari[0]);
      const endDate = new Date(selectedAppuntamento.orari[selectedAppuntamento.orari.length - 1]);
      endDate.setMinutes(endDate.getMinutes() + 30);

      // --- 1. Email e ICS per il Cliente ---
      const htmlCliente = `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${cliente.nome ?? ''} ${cliente.cognome ?? ''},</p>
        <p>This is to confirm your appointment scheduled as follows:</p>
        <ul>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Time:</strong> ${timeRange}</li>
          <li><strong>Representative:</strong> ${commerciale?.name || ''} ${commerciale?.cognome || ''}</li>
        </ul>
        <p>Best regards,<br/>
           ${commerciale?.name || ''} ${commerciale?.cognome || ''}
        </p>
      `;
      
      const icsContentCliente = createIcsContent(
        String(selectedAppuntamento.id), // (FIX) Cast a string
        startDate,
        endDate,
        `Appuntamento ZEGNA BARUFFA: ${cliente.azienda ?? ''}`,
        `Appuntamento con ${commerciale?.name || ''} ${commerciale?.cognome || ''} per ${cliente.azienda ?? ''}.`,
        'PITTI FILATI'
      );
      const icsBase64Cliente = btoa(icsContentCliente);


      const promiseCliente = fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [cliente.email],
          subject: 'ZEGNA BARUFFA LANE BORGOSESIA - Conferma Appuntamento / Appointment confirmation PITTI FILATI',
          html: htmlCliente,
          ics: {
            filename: 'appuntamento.ics',
            content: icsBase64Cliente,
          },
        }),
      });

      // --- 2. Email e ICS per Commerciali (Internal) ---
      const emailsCommerciali = [
        ...(selectedAppuntamento.invitati?.map((i: any) => i.email) ?? []),
        session?.user.email,
      ].filter(Boolean);

      const promises = [promiseCliente];

      if (emailsCommerciali.length > 0) {
        const htmlCommerciale = `
          <h2>Dettagli Appuntamento Fiera</h2>
          <p>È stato confermato un appuntamento:</p>
          <ul>
            <li><strong>Cliente:</strong> ${cliente.nome ?? ''} ${cliente.cognome ?? ''}</li>
            <li><strong>Email Cliente:</strong> ${cliente.email ?? 'N/D'}</li>
            <li><strong>Azienda:</strong> ${cliente.azienda ?? 'N/D'}</li>
            <li><strong>Ruolo:</strong> ${cliente.ruolo ?? 'N/D'}</li>
            <li><strong>Data:</strong> ${formattedDate}</li>
            <li><strong>Orario:</strong> ${timeRange}</li>
            <li><strong>Commerciale Principale:</strong> ${commerciale?.name || ''} ${commerciale?.cognome || ''}</li>
            ${selectedAppuntamento.note ? `<li><strong>Note:</strong> ${selectedAppuntamento.note}</li>` : ''}
          </ul>
          <p>Questo è un promemoria automatico.</p>
        `;

        const icsContentCommerciale = createIcsContent(
          String(selectedAppuntamento.id) + '-commerciale', // (FIX) Cast a string
          startDate,
          endDate,
          `APPUNTAMENTO: ${cliente.azienda ?? ''} (${cliente.nome ?? ''} ${cliente.cognome ?? ''})`,
          `Appuntamento con ${cliente.azienda ?? ''}.<br/>Cliente: ${cliente.nome ?? ''} ${cliente.cognome ?? ''}<br/>Email: ${cliente.email ?? 'N/D'}<br/>Note: ${selectedAppuntamento.note ?? 'N/D'}`,
          'PITTI FILATI'
        );
        const icsBase64Commerciale = btoa(icsContentCommerciale);

        const promiseCommerciale = fetch('/api/sendMail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: emailsCommerciali,
            subject: `ZEGNA BARUFFA: Dettagli Appuntamento Fiera - ${cliente.azienda ?? cliente.nome}`,
            html: htmlCommerciale,
            ics: {
              filename: 'appuntamento_interno.ics',
              content: icsBase64Commerciale,
            },
          }),
        });
        promises.push(promiseCommerciale);
      }

      // --- 3. Invia tutto ---
      const results = await Promise.all(promises);
      const allOk = results.every(res => res.ok);

      if (allOk) {
        setToast({ message: 'Email inviate con successo', type: 'success' });
      } else {
        const failed = results.filter(res => !res.ok);
        console.error("Errore invio email:", failed);
        setToast({ message: `Errore: ${failed.length} email non inviate.`, type: 'error' });
      }

    } catch (error) {
      console.error(error);
      setToast({ message: 'Errore grave durante l\'invio dell\'email', type: 'error' });
    } finally {
      setIsSending(false);
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
            {selectedAppuntamento.cliente.nome && <li><strong>{t('nome')}:</strong> {selectedAppuntamento.cliente.nome}</li>}
            {selectedAppuntamento.cliente.email && <li><strong>Email:</strong> {selectedAppuntamento.cliente.email}</li>}
            {selectedAppuntamento.cliente.azienda && <li><strong>{t('azienda')}:</strong> {selectedAppuntamento.cliente.azienda}</li>}
            {selectedAppuntamento.cliente.ruolo && <li><strong>{t('ruolo')}:</strong> {selectedAppuntamento.cliente.ruolo}</li>}
            {selectedAppuntamento.cliente.numero && <li><strong>{t('telefono')}:</strong> {selectedAppuntamento.cliente.numero}</li>}
              <li><strong>{t('orari')}:</strong> {selectedAppuntamento.orari.map((o: string) =>
                new Date(o).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
              ).join(', ')}</li>
              {invitatoda && (
  <li>
    <strong>Creato da:</strong> {invitatoda.nome} {invitatoda.cognome}
  </li>
)}
             {selectedAppuntamento.cliente.nome && <li><strong>{t('note')}:</strong> {selectedAppuntamento.note}</li>}
            </ul>
            <div className="flex justify-end gap-2">
              <button 
                name="mail" 
                onClick={handleSendMail} 
                className="px-4 py-2 bg-primary text-white rounded-xl disabled:opacity-50"
                disabled={isSending} // <-- (FIX 3) Disabilita bottone
              > 
                {isSending ? t('invioInCorso') : t('inviaEmail')}
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
          {clienteEsistente && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-lg w-full text-center space-y-4">
          <h2 className="text-lg font-semibold">Cliente già presente</h2>
          <p className="text-sm">Vuoi sovrascrivere i dati esistenti con quelli inseriti nel form?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setClienteEsistente(false)}
              className="px-4 py-2 bg-gray-300 rounded-xl"
            >
              Annulla
            </button>
            <button
              onClick={confermaSovrascrittura}
              className="px-4 py-2 bg-primary text-white rounded-xl"
            >
              Conferma
            </button>
          </div>
        </div>
      </div>
    )}
    </div>

  );
};

export default TimeSlotList;

