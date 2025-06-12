// 'use client'

// import React, { useRef, useState, useEffect } from 'react'
// import { useDate } from '@/context/DateContext'
// import { createAppuntamento } from '@/actions/createAppuntamento'
// import { getAvailableSlotsByDay } from '@/actions/getSlotLiberi'
// import { useSession } from 'next-auth/react'
// import { getAppuntamentiByDayAndCommerciale } from '@/actions/getSlotPrenotati'
// import { FiTrash2 } from 'react-icons/fi'
// import { deleteAppuntamento } from '@/actions/deleteSlot'
// import useSWR from 'swr'
// import { useTranslation } from "@/lib/useTranslation";
// export const dynamic = 'force-dynamic'; // 👈 disabilita cache


// const TimeSlotList = ({ userId }: { userId: string }) => {    const { t } = useTranslation();
  
//   const [selectedSlots, setSelectedSlots] = useState<Date[]>([])
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const formRef = useRef<HTMLFormElement>(null)
//   const { selectedDate } = useDate()
//   const { data: session } = useSession()
//   const [selectedAppuntamento, setSelectedAppuntamento] = useState<any | null>(null)
//   const [isSending, setIsSending] = useState(false);
//   const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  //  const handleSendEmail = async () => {
  //    const cliente = selectedAppuntamento?.cliente;
  //    const orario = selectedAppuntamento?.orari;
  //    const commerciale = selectedAppuntamento?.commerciale;
  
  //    if (!cliente?.email) {
  //      setToast({ message: t('emailNonDisponibile'), type: 'error' });
  //      return;
  //    }
  
  //    setIsSending(true);
  
  //    const start = new Date(orario[0]);
  //    const end = new Date(orario[orario.length - 1]);
  //    end.setMinutes(end.getMinutes() + 30);
  //    const pad = (n: number) => n.toString().padStart(2, '0');
  //    const formattedTime = `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
  //    const formattedDate = start.toLocaleDateString('it-IT');
  
  //    const html = `
  //      <h2>Dettagli appuntamento</h2>
  //      <p><strong>Cliente:</strong> ${cliente.nome ?? ''} ${cliente.cognome ?? ''}</p>
  //      <p><strong>Azienda:</strong> ${cliente.azienda ?? ''}</p>
  //      <p><strong>Ruolo:</strong> ${cliente.ruolo ?? ''}</p>
  //      <p><strong>Data:</strong> ${formattedDate}</p>
  //      <p><strong>Orario:</strong> ${formattedTime}</p>
  //      <p><strong>Commerciale:</strong> ${commerciale?.name ?? ''} ${commerciale?.cognome ?? ''} (${commerciale?.societa ?? ''})</p>
  //      <p><strong>Note:</strong><br/>${selectedAppuntamento.note ?? ''}</p>
  //    `;
  
  //    try {
  //      const res = await fetch('/api/sendMail', {
  //        method: 'POST',
  //        headers: { 'Content-Type': 'application/json' },
  //        body: JSON.stringify({
  //          to: cliente.email,
  //          subject: 'Dettagli Appuntamento',
  //          html,
  //        }),
  //      });
  
  //      if (res.ok) {
  //        setToast({ message: t('emailInviata'), type: 'success' });
  //      } else {
  //        throw new Error('Errore invio email');
  //      }
  //    } catch (error) {
  //      console.error(error);
  //      setToast({ message: t('errInvioEmail'), type: 'error' });
  //    }
  
  //    setIsSending(false);
  //  };
  
//   const fetchSlotsData = async (date: Date, userId: string) => {
//     const formattedDate = date.toLocaleDateString('it-IT')
//     const available = await getAvailableSlotsByDay(formattedDate, userId)
//     const allApp = await getAppuntamentiByDayAndCommerciale(userId, date)

//     const ofThatDay = allApp.filter(app =>
//       app.orari.some((str: string) => {
//         const slotDate = new Date(str)
//         return slotDate.toLocaleDateString('it-IT') === formattedDate
//       })
//     )

//     return {
//       slots: available.map((s: any) => new Date(s)),
//       booked: ofThatDay,
//     }
//   }

//   const { data, isLoading, mutate } = useSWR(
//     userId ? [`slots`, selectedDate.toISOString(), userId] : null,
//     () => fetchSlotsData(selectedDate, userId)
//   )

//   const slots = data?.slots ?? []
//   const booked = data?.booked ?? []

//   // if (isLoading) return <p>Caricamento slot disponibili...</p>

//   const handleSlotClick = (slot: Date) => {
//     setSelectedSlots([slot])
//     setIsModalOpen(true)
//   }

//   const closeModal = () => {
//     setSelectedSlots([])
//     setIsModalOpen(false)
//   }

//   const addNextSlot = () => {
//     if (selectedSlots.length === 0) return

//     const lastSlot = selectedSlots[selectedSlots.length - 1]
//     const nextIndex = slots.findIndex(s => s.getTime() === lastSlot.getTime()) + 1

//     if (nextIndex < slots.length) {
//       const nextSlot = slots[nextIndex]
//       const expectedNextTime = new Date(lastSlot)
//       expectedNextTime.setMinutes(lastSlot.getMinutes() + 30)

//       if (nextSlot.getTime() === expectedNextTime.getTime()) {
//         setSelectedSlots([...selectedSlots, nextSlot])
//       }
//     }
//   }

//   const formatTimeRange = () => {
//     if (selectedSlots.length === 0) return ''

//     const start = selectedSlots[0]
//     const end = new Date(selectedSlots[selectedSlots.length - 1])
//     end.setMinutes(end.getMinutes() + 30)

//     return `${start.toLocaleTimeString('it-IT', {
//       hour: '2-digit',
//       minute: '2-digit',
//     })} - ${end.toLocaleTimeString('it-IT', {
//       hour: '2-digit',
//       minute: '2-digit',
//     })}`
//   }

//   const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)
//     const data = Object.fromEntries(formData.entries())

//     try {
//       await createAppuntamento({
//         nome: data.nome as string,
//         cognome: data.cognome as string,
//         azienda: data.azienda as string,
//         ruolo: data.ruolo as string,
//         email: data.email as string,
//         note: data.note as string,
//         numero: data.telefono as string,
//         orari: selectedSlots,
//       })
//       formRef.current?.reset()
//       alert(t('appsucc'))
//       closeModal()
//       mutate()
//     } catch (error) {
//       console.error('Errore durante la creazione:', error)
//       alert((t('apperr'))
//     )
//     }
//   }

//   const handleBookedClick = (app: any) => {
//     setSelectedAppuntamento(app)
//   }

//   const handleDeleteAppuntamento = async () => {
//     if (!selectedAppuntamento) return
//     const confirmDelete = confirm(t('confdel'))
//     if (!confirmDelete) return

//     const res = await deleteAppuntamento(selectedAppuntamento.id)
//     if (res.success) {
//       setSelectedAppuntamento(null)
//       mutate()
//     } else {
//       alert(t('errdel'))
//     }
//   }
//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => setToast(null), 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [toast]);
//   return (
//     <div className="flex items-center justify-center grow">
//       <div className="border p-10 rounded-xl shadow-[5px] space-y-10">
//         {/* Slot disponibili */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">{t('slotdisponibili')}</h2>
//           <div className="overflow-x-auto whitespace-nowrap max-h-[30vh]">
//             <div className="flex flex-wrap gap-3">
//               {slots.map((slot, index) => (
//                 <div
//                   key={index}
//                   onClick={() => handleSlotClick(slot)}
//                   className={`cursor-pointer px-4 py-2 font-semibold rounded-[5px] text-center text-primary border border-primary hover:border-secondary hover:text-secondary shadow hover:shadow-xl hover:bg-blue-200 ${
//                     selectedSlots.some(s => s.getTime() === slot.getTime()) ? "bg-blue-200" : ""
//                   }`}
//                 >
//                   {slot.toLocaleTimeString('it-IT', {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Slot occupati */}
//         <div>
//           <h2 className="text-xl font-semibold mb-4">{t('slotoccupati')}</h2>
//           <div className="overflow-x-auto max-w-full space-y-4">
//             <div className="flex flex-wrap gap-3 w-max">
//               {booked.map((app) => {
//                 if (app.orari.length === 0) return null

//                 const start = new Date(app.orari[0])
//                 const end = new Date(app.orari[app.orari.length - 1])
//                 end.setMinutes(end.getMinutes() + 30)

//                 const timeRange = `${start.toLocaleTimeString('it-IT', {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })} - ${end.toLocaleTimeString('it-IT', {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}`
           
                
//                 return (
//                   <div
//                     key={app.id}
//                     onClick={() => handleBookedClick(app)}
//                     className="cursor-pointer px-4 py-2 rounded-[5px] text-center text-primary border border-primary bg-blue-100 shadow hover:shadow-xl hover:bg-blue-200 min-w-[120px]"
//                   >
//                     {timeRange}
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal nuovo appuntamento */}
//       {isModalOpen && selectedSlots.length > 0 && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 shadow-lg max-w-2xl w-full">
//             <h3 className="text-lg font-bold mb-2">{t('slotsel')}</h3>
//             <p className="mb-4">{formatTimeRange()}</p>

//             <div className="mb-4">
//               <button
//                 onClick={addNextSlot}
//                 className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
//               >
//                 {t('aggiungislot')}
//               </button>
//             </div>

//             <form ref={formRef} onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
//               <input type="text" name="nome" placeholder={t('nome')} className="w-full p-2 border rounded" />
//               <input type="text" name="cognome" placeholder={t('cognome')}className="w-full p-2 border rounded" />
//               <input type="tel" name="telefono" placeholder={t('telefono')} className="w-full p-2 border rounded" />
//               <input type="email" name="email" placeholder="Email *" required className="w-full p-2 border rounded" />
//               <input type="text" name="azienda" placeholder={t('aziendaast')} required className="w-full p-2 border rounded" />
//               <input type="text" name="ruolo" placeholder={t('ruolo')} className="w-full p-2 border rounded" />
//               <textarea name="note" placeholder={t('note')} className="w-full p-2 border rounded col-span-2" />
//               <div className="col-span-2 flex justify-end gap-2 mt-4">
//                 <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400">{t('annulla')}</button>
//                 <button type="submit" className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90">{t('invia')}</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal dettagli appuntamento */}
//       {selectedAppuntamento && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-2xl p-6 shadow-lg max-w-xl w-full">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-bold">{t('dettapp')}</h3>
//               <button onClick={handleDeleteAppuntamento} className="text-red-600 hover:text-red-800">
//                 <FiTrash2 className="w-5 h-5" />
//               </button>
//             </div>
//             <ul className="mb-4">
//               <li><strong>{t('nome')}:</strong> {selectedAppuntamento.cliente.nome} {selectedAppuntamento.cliente.cognome}</li>
//               <li><strong>Email:</strong> {selectedAppuntamento.cliente.email}</li>
//               <li><strong>{t('azienda')}:</strong> {selectedAppuntamento.cliente.azienda}</li>
//               <li><strong>{t('ruolo')}:</strong> {selectedAppuntamento.cliente.ruolo}</li>
//               <li><strong>{t('telefono')}:</strong> {selectedAppuntamento.cliente.numero}</li>
//               <li><strong>Orari:</strong> {selectedAppuntamento.orari.map((o: string) => new Date(o).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })).join(', ')}</li>
//               <li><strong>{t('note')}:</strong> {selectedAppuntamento.note}</li>
//             </ul>
//             <div className="flex justify-end gap-2 mt-4">
//   <button
//     onClick={handleSendEmail}
//     disabled={isSending}
//     className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50"
//   >
//     {isSending ? t('invioInCorso') : t('inviaEmail')}
//   </button>
//   <button
//     onClick={() => setSelectedAppuntamento(null)}
//     className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
//   >
//     {t('chiudi')}
//   </button>
// </div>

//           </div>
//         </div>
//       )}
//       {toast && (
//         <div className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white ${
//           toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
//         }`}>
//           {toast.message}
//         </div>
//       )}
//     </div>
//   )
  
// }
// export default TimeSlotList

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
              <input name="nome" placeholder={t('nome')} required className="border rounded p-2" />
              <input name="cognome" placeholder={t('cognome')} required className="border rounded p-2" />
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
              <li><strong>Orari:</strong> {selectedAppuntamento.orari.map((o: string) =>
                new Date(o).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
              ).join(', ')}</li>
              <li><strong>{t('note')}:</strong> {selectedAppuntamento.note}</li>
            </ul>
            <div className="flex justify-end gap-2">
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
