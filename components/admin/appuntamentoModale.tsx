// app/(dashboard)/calendario/AppuntamentoModal.tsx
'use client';

import React from 'react';
import { Dialog } from '@headlessui/react';
import { FiTrash2 } from 'react-icons/fi'
import { useTranslation } from "@/lib/useTranslation";

type Props = {

  appuntamento: {
    id : string;
    cliente: {
      nome: string | null;
      cognome: string | null;
      email?: string | null;
      azienda?: string | null;
    };
    commerciale: {
      name: string | null;
    };
    orario: string[];
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
          <Dialog.Title className="text-lg font-bold">{t('dettapp')}</Dialog.Title>
              <button onClick={handleDeleteAppuntamento} className="text-red-600 hover:text-red-800">
                <FiTrash2 className="w-5 h-5" />
              </button>
          <div>
            <p><strong>{t('cliente')}:</strong> {cliente.nome} {cliente.cognome}</p>
            {cliente.email && <p><strong>Email:</strong> {cliente.email}</p>}
            {cliente.azienda && <p><strong>{t('azienda')}:</strong> {cliente.azienda}</p>}
            <p><strong>{t('commerciale')}:</strong> {commerciale.name}</p>
            <p><strong>{t('orario')}:</strong></p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {orario.map((o, i) => (
                <li key={i}>{format(o)}</li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t('chiudi')}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
