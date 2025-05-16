// app/(dashboard)/calendario/AppuntamentoModal.tsx
'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { FiTrash2 } from 'react-icons/fi'
import { useTranslation } from "@/lib/useTranslation";
import { PiBuildingsLight, PiBriefcaseLight, PiUserLight, PiClockLight, PiNoteBlankLight,  } from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
import { FaBuildingUser } from "react-icons/fa6";
type Props = {

  appuntamento: {
    id : string;
    cliente: {
      nome: string | null;
      cognome: string | null;
      email?: string | null;
      azienda?: string | null;
      ruolo?: string | null;
    };
    commerciale: {
      name: string | null;
      cognome: string | null;
      societa: string | null;
    };
    orario: string[];
    note: string;
  };
  onClose: () => void;
};

export const AppuntamentoModal: React.FC<Props> = ({ appuntamento, onClose }) => {
  
  const { cliente, commerciale, orario } = appuntamento;

  const format = (iso: string) => {
    const d = new Date(iso);
    return `${d.toLocaleDateString()} ${d.getHours()}:${d.getMinutes() === 0 ? '00' : '30'}`;
  };
  const { t } = useTranslation();

  const handleDeleteAppuntamento = async () => {
    const res = await fetch(`/api/appuntamenti/${appuntamento.id}`, {
      method: 'DELETE',
    });
  
    if (res.ok) {
      onClose(); // chiude il modale
      // opzionale: triggera un refresh del calendario
    } else {
      console.error(t('errdel'));
    }
  };
  

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
          <div className='flex  justify-between items-center'>
          <Dialog.Title className="text-lg font-semibold">{t('dettapp')}</Dialog.Title>
              <button onClick={handleDeleteAppuntamento} className="text-red-600 hover:text-red-800">
                <FiTrash2 className="w-5 h-5" />
              </button>
              </div>
          <div className='text-sm'>
            <p className='flex gap-x-2 mb-3 items-center'><PiUserLight className="text-primary text-lg"/><span className='font-semibold'>{t('cliente')}:</span> {cliente.nome} {cliente.cognome}</p>
            {cliente.email && <p className='flex gap-x-2 mb-3 items-center'><TfiEmail className="text-primary text-lg"/><span className='font-semibold'>Email:</span> {cliente.email}</p>}
            {cliente.azienda && <p className='flex gap-x-2 mb-3 items-center'><PiBuildingsLight className="text-primary text-lg"/><span className='font-semibold'>{t('azienda')}:</span> {cliente.azienda}</p>}
            {cliente.ruolo && <p className='flex gap-x-2 mb-3 items-center'><PiBriefcaseLight className="text-primary text-lg"/><span className='font-semibold'>{t('ruolo')}:</span> {cliente.ruolo}</p>}
            <p className='flex gap-x-2 mb-3 items-center'><FaBuildingUser className="text-primary text-lg"/><span className='font-semibold'>{t('commerciale')}:</span> {commerciale.name} {commerciale.cognome}</p>
            <p className='flex gap-x-2 mb-3 items-center'>
  <PiClockLight className="text-primary text-lg" />
  <span className='font-semibold'>{t('quando')}:</span>
  <span className="ml-1">
    {(() => {
      const start = new Date(orario[0]);
      const end = new Date(orario[orario.length - 1]);
      end.setMinutes(end.getMinutes() + 30);

      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedTime = `${pad(start.getHours())}:${pad(start.getMinutes())} ${t('to')} ${pad(end.getHours())}:${pad(end.getMinutes())}`;
      const formattedDate = start.toLocaleDateString('it-IT');

      return `${formattedDate} ${t('dalle')} ${formattedTime}`;
    })()}
  </span>
</p>
<p className='flex gap-x-2 mb-3 items-center'><PiNoteBlankLight className="text-primary text-lg"/><span className='font-semibold'>{t('note')}:</span></p><p> <span className='block p-2 border border-1 rounded-xl mb-3'>{appuntamento.note}</span></p>

          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-white rounded hover:bg-blue-700"
            >
              {t('chiudi')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
