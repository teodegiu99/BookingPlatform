// // 'use client';

// // import React, { useState } from 'react';
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { toast } from 'sonner';
// // import { useTranslation } from "@/lib/useTranslation";

// // type Appuntamento = {
// //   orario: string[];
// //   note: string;
// //   commerciale: {
// //     id: string;
// //   };
// // };

// // type Props = {
// //   open: boolean;
// //   onClose: () => void;
// //   commercialeId: string;
// //   selectedDate: Date;
// //   startHour: string;
// //   appuntamenti: Appuntamento[]; 
// // };
// // export const CreaAppuntamentoModal: React.FC<Props> = ({
// //   open,
// //   onClose,
// //   commercialeId,
// //   selectedDate,
// //   startHour,
// //   appuntamenti,
// // }) => {
  
// //   const [form, setForm] = useState({
// //     nome: '',
// //     cognome: '',
// //     azienda: '',
// //     ruolo: '',
// //     email: '',
// //     telefono: '',
// //     note: '',
// //     durata: 30, // minuti
// //   });
// //   const [loading, setLoading] = useState(false);

// //   const handleChange = (
// //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
// //   ) => {
// //     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //   };

// //   const handleDurataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setForm((prev) => ({ ...prev, durata: parseInt(e.target.value, 10) }));
// //   };
// //   const { t } = useTranslation();

// //   const isSlotOccupied = (commercialeId: string, slotTime: number) => {
// //     if (!appuntamenti || appuntamenti.length === 0) return false; // Se non ci sono appuntamenti, ritorna false
// //     return appuntamenti.some((a) =>
// //       a.commerciale.id === commercialeId &&
// //       a.orario.some((o) => new Date(o).getTime() === slotTime)
// //     );
// //   };
  

  
// //   const addNextSlot = () => {
// //     const start = new Date(selectedDate);
// //     const [hour, minute] = startHour.split(':').map(Number);
// //     start.setHours(hour, minute, 0, 0);
  
// //     const currentDuration = form.durata;
// //     const nextSlot = new Date(start);
// //     nextSlot.setMinutes(nextSlot.getMinutes() + currentDuration);
  
// //     // Normalizza il nextSlot per il confronto (rimuove secondi e millisecondi)
// //     const normalizedNextSlot = new Date(nextSlot);
// //     normalizedNextSlot.setSeconds(0, 0);
// //     let normalizedNextSlotTime = normalizedNextSlot.getTime();
  
// //     // Verifica se il prossimo slot è occupato
// //     if (isSlotOccupied(commercialeId, normalizedNextSlotTime)) {
// //       toast.warning(t('proxslotnodisp'));
// //     } else {
// //       // Se non è occupato, aggiungi 30 minuti e aggiorna la durata
// //       toast.info(t('proxslotadd'));
// //       setForm((prev) => ({
// //         ...prev,
// //         durata: prev.durata + 30, // Aggiungi 30 minuti
// //       }));
// //     }
// //   };
  

// //   const handleSubmit = async () => {
// //     setLoading(true);
// //     try {
// //       const start = new Date(selectedDate);
// //       const [hour, minute] = startHour.split(':').map(Number);
// //       start.setHours(hour, minute, 0, 0);
  
// //       const slots: string[] = [];
// //       const slotCount = form.durata / 30;
// //       for (let i = 0; i < slotCount; i++) {
// //         const slot = new Date(start);
// //         slot.setMinutes(slot.getMinutes() + i * 30);
// //         slots.push(slot.toISOString());
// //       }
  
// //       console.log('Dati da inviare:', {
// //         cliente: {
// //           nome: form.nome,
// //           cognome: form.cognome,
// //           azienda: form.azienda,
// //           ruolo: form.ruolo,
// //           email: form.email,
// //           telefono: form.telefono,
// //         },
// //         orario: slots,
// //         commercialeId,
// //         note: form.note,
// //       });
  
// //       const res = await fetch('/api/appuntamenti', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({
// //           cliente: {
// //             nome: form.nome,
// //             cognome: form.cognome,
// //             azienda: form.azienda,
// //             ruolo: form.ruolo,
// //             email: form.email,
// //             telefono: form.telefono,
// //           },
// //           orario: slots,
// //           commercialeId,
// //           note: form.note,
// //         }),
// //       });
  
// //       if (!res.ok) throw new Error('Errore nel salvataggio');
  
// //       toast.success(t('appsucc'));

// // await fetch('/api/sendMail', {
// //   method: 'POST',
// //   headers: { 'Content-Type': 'application/json' },
// //   body: JSON.stringify({
// //     to: form.email,
// //     subject: 'Conferma appuntamento test',
// //     html: `
// //       <p>Ciao ${form.nome},</p>
// //       <p>il tuo appuntamento è stato confermato per il giorno <strong>${selectedDate.toLocaleDateString()}</strong> alle <strong>${startHour}</strong> con durata di <strong>${form.durata} minuti</strong>.</p>
// //       <p>Grazie,<br/></p>
// //     `,
// //   }),
// // });
// //       onClose();
// //     } catch (err) {
// //       toast.error('Errore nella creazione');
// //       console.error(err); // Aggiungi un log per catturare l'errore
// //     } finally {
// //       setLoading(false);
// //     }
// //   };
  

// //   return (
// //     <Dialog open={open} onOpenChange={onClose} >
// //       <DialogContent className='bg-neutral'>
// //         <DialogHeader>
// //           <DialogTitle>{t('nuovoappuntamento')}</DialogTitle>
// //         </DialogHeader>
// //         <div className="grid gap-2">
// //           <Label>{t('nome')}</Label>
// //           <Input name="nome" value={form.nome} onChange={handleChange} />

// //           <Label>{t('cognome')}</Label>
// //           <Input name="cognome" value={form.cognome} onChange={handleChange} />

// //           <Label>{t('azienda')} *</Label>
// //           <Input name="azienda" value={form.azienda} onChange={handleChange} />

// //           <Label>{t('ruolo')}</Label>
// //           <Input name="ruolo" value={form.ruolo} onChange={handleChange} />

// //           <Label>Email *</Label>
// //           <Input name="email" value={form.email} onChange={handleChange} type="email" />

// //           <Label>{t('telefono')}</Label>
// //           <Input name="telefono" value={form.telefono} onChange={handleChange} />
// //           <Label>{t('note')}</Label>
// //           <textarea name="note" value={form.note} onChange={handleChange} />

// //           <Label>{t('durata')} (minuti)</Label>
// //                <button
// //                 onClick={addNextSlot}
// //                 className="px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200"
// //               >
// //                 {t('aggiungislot')}
// //               </button>
// //           <Input
// //             type="number"
// //             name={t('durata')}
// //             value={form.durata}
// //             onChange={handleDurataChange}
// //             min={30}
// //             step={30}
// //           />
// //         </div>
// //         <div className="flex justify-end gap-2 mt-4">
// //           <Button variant="outline" onClick={onClose} disabled={loading}>
// //           {t('annulla')}
// //           </Button>
// //           <Button onClick={handleSubmit} disabled={loading}>
// //             {loading ? t('salv') : t('salva')}
// //           </Button>
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // };
// 'use client';

// import React, { useEffect, useState } from 'react';
// import Select from 'react-select';
// import { User } from '@prisma/client';

// type UserOption = {
//   value: string;
//   label: string;
// };
// type Appuntamento = {
//   id: string;
//   orario: string[];
//   note: string;
//   cliente: {
//     nome: string | null;
//     cognome: string | null;
//     email?: string | null;
//     azienda?: string | null;
//     ruolo?: string | null;
//     telefono?: string | null;
//   };
//   commerciale: {
//     id: string;
//     name: string | null;
//     cognome: string | null;
//     image: string | null;
//     color: string | null;
//     societa: string | null;
//   };
// };

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   commercialeId: string;
//   selectedDate: string;
//   startHour: string;
//   appuntamenti: Appuntamento[]; // ✅ aggiungi questo
// };

// export const CreaAppuntamentoModal: React.FC<Props> = ({
//   open,
//   onClose,
//   commercialeId,
//   selectedDate,
//   startHour,
// }) => {
//   const [nome, setNome] = useState('');
//   const [cognome, setCognome] = useState('');
//   const [azienda, setAzienda] = useState('');
//   const [ruolo, setRuolo] = useState('');
//   const [email, setEmail] = useState('');
//   const [telefono, setTelefono] = useState('');
//   const [note, setNote] = useState('');
//   const [invitatiOptions, setInvitatiOptions] = useState<UserOption[]>([]);
//   const [selectedInvitati, setSelectedInvitati] = useState<UserOption[]>([]);

//   // Fetch commerciali (escludendo l'organizzatore)
//   useEffect(() => {
//     const fetchCommerciali = async () => {
//       const res = await fetch('/api/commerciali');
//       const data = await res.json();
//       const options = data
//         .filter((u: User) => u.id !== commercialeId)
//         .map((u: User) => ({
//           value: u.id,
//           label: `${u.name ?? ''} ${u.cognome ?? ''} (${u.email})`,
//         }));
//       setInvitatiOptions(options);
//     };

//     if (open) fetchCommerciali();
//   }, [open, commercialeId]);

//   const handleSubmit = async () => {
//     const res = await fetch('/api/appuntamenti', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         cliente: {
//           nome,
//           cognome,
//           azienda,
//           ruolo,
//           email,
//           telefono,
//         },
//         orario: [`${selectedDate}T${startHour}`],
//         note,
//         commercialeId,
//         invitati: selectedInvitati.map((i) => i.value),
//       }),
//     });

//     if (res.ok) {
//       onClose();
//     } else {
//       alert('Errore nella creazione dell’appuntamento');
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//       <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
//         <h2 className="text-xl font-semibold">Nuovo Appuntamento</h2>

//         {/* Cliente */}
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Nome"
//           value={nome}
//           onChange={(e) => setNome(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Cognome"
//           value={cognome}
//           onChange={(e) => setCognome(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Azienda"
//           value={azienda}
//           onChange={(e) => setAzienda(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Ruolo"
//           value={ruolo}
//           onChange={(e) => setRuolo(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Telefono"
//           value={telefono}
//           onChange={(e) => setTelefono(e.target.value)}
//         />

//         {/* Invita altri commerciali */}
//         <label className="block text-sm font-medium text-gray-700">Invita altri commerciali</label>
//         <Select
//           isMulti
//           options={invitatiOptions}
//           value={selectedInvitati}
//           onChange={(val) => setSelectedInvitati(val as UserOption[])}
//         />

//         {/* Note */}
//         <textarea
//           className="w-full border p-2 rounded"
//           placeholder="Note (opzionale)"
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//         />

//         {/* Pulsanti */}
//         <div className="flex justify-end space-x-2 pt-4">
//           <button className="px-4 py-2 rounded border" onClick={onClose}>
//             Annulla
//           </button>
//           <button
//             className="px-4 py-2 rounded bg-blue-600 text-white"
//             onClick={handleSubmit}
//           >
//             Crea
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // export default CreaAppuntamentoModal;
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
      
   await fetch('/api/appuntamenti', {
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
      toast.success('Appuntamento creato con successo.');
  onClose();
    } catch (err: any) {
      alert(err.message); // oppure toast, dialog, ecc.
    }
  }
    
  //   if (res.ok) {
  //     toast.success('Appuntamento creato con successo.');
  //     onClose();
  //   } else {
  //     toast.error('Errore nella creazione dell’appuntamento.');
  //   }
  // };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold">Nuovo Appuntamento</h2>

        <input className="w-full border p-2 rounded" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Azienda" value={azienda} onChange={(e) => setAzienda(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Ruolo" value={ruolo} onChange={(e) => setRuolo(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Telefono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <label className="block text-sm font-medium text-gray-700">Invita altri commerciali</label>
        <Select isMulti options={invitatiOptions} value={selectedInvitati} onChange={(val) => setSelectedInvitati(val as UserOption[])} />

        <textarea className="w-full border p-2 rounded" placeholder="Note (opzionale)" value={note} onChange={(e) => setNote(e.target.value)} />

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
          <button onClick={addNextSlot} className="px-3 py-1 bg-blue-500 text-white rounded">
            Aggiungi slot
          </button>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button className="px-4 py-2 rounded border" onClick={onClose}>
            Annulla
          </button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={handleSubmit}>
            Crea
          </button>
        </div>
      </div>
    </div>
  );
};
