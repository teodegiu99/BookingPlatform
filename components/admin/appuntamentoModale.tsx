'use client';

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { FiTrash2 } from 'react-icons/fi';
import { useTranslation } from "@/lib/useTranslation";
import {
  PiBuildingsLight,
  PiBriefcaseLight,
  PiUserLight,
  PiClockLight,
  PiNoteBlankLight,
} from "react-icons/pi";
import { TfiEmail } from "react-icons/tfi";
// import { FaBuildingUser } from "react-icons/fa6"; // Non usato
import { CiUser } from "react-icons/ci";

type Props = {
  appuntamento: {
    id: string;
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
    ownerId: string;
    commercialeId: string;
    invitati?: string[];
    orario: string[];
    note: string;
  };
  onClose: () => void;
};

type Invitato = {
  id: string;
  name: string;
  cognome: string;
};

export const AppuntamentoModal: React.FC<Props> = ({ appuntamento, onClose }) => {
  const { cliente, commerciale, orario } = appuntamento;
  const { t } = useTranslation();
  type Appuntamento = Props['appuntamento'];
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [altCommercialeName, setAltCommercialeName] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [invitati, setInvitati] = useState<Invitato[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchInvitati = async () => {
      if (appuntamento.invitati && appuntamento.invitati.length > 0) {
        const risultati = await getNomiInvitati(appuntamento.invitati);
        const filtrati = risultati.filter((inv) => inv.id !== appuntamento.commercialeId);
        setInvitati(filtrati);
      }
    };
    fetchInvitati();
  }, [appuntamento.invitati, appuntamento.commercialeId]);

  const getNomiInvitati = async (ids: string[]): Promise<Invitato[]> => {
    if (!ids || ids.length === 0) return [];

    const res = await fetch('/api/user/invitati', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    });

    if (!res.ok) throw new Error('Errore nel recupero utenti');

    const data = await res.json();

    return data.map((u: any) => ({
      id: u.id,
      name: u.name ?? '',
      cognome: u.cognome ?? '',
    }));
  };

  const getCommercialeNameIfInvitato = async (app: Appuntamento): Promise<string | null> => {
    if (!app || !app.commerciale || !app['ownerId'] || !app['commercialeId']) return null
    if (app.ownerId === app.commercialeId) return null

    try {
      const res = await fetch(`/api/users/${app.ownerId}`)
      if (!res.ok) throw new Error('Errore nel recupero del commerciale')

      const data = await res.json()
      const nome = data?.name ?? ''
      const cognome = data?.cognome ?? ''

      return `${nome} ${cognome}`.trim()
    } catch (error) {
      console.error('Errore nel recupero commerciale invitato:', error)
      return null
    }
  }

  useEffect(() => {
    const fetchAltCommerciale = async () => {
      const name = await getCommercialeNameIfInvitato(appuntamento);
      setAltCommercialeName(name);
    };
    fetchAltCommerciale();
  }, [appuntamento]);

  const handleDeleteAppuntamento = async () => {
    setIsDeleting(true);
    const res = await fetch(`/api/appuntamenti/${appuntamento.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setShowConfirm(false);
      onClose();
    } else {
      console.error(t('errdel'));
      setToast({ message: t('errdel'), type: 'error' });
    }

    setIsDeleting(false);
  };

  const handleSendEmail = async () => {
    if (!cliente.email) {
      setToast({ message: t('emailNonDisponibile'), type: 'error' });
      return;
    }

    setIsSending(true);

    try {
      // 1. Recupera le email dei commerciali/invitati
      let destinatariIds: string[] = [];
      if (appuntamento.commercialeId === appuntamento.ownerId) {
        destinatariIds = [
          appuntamento.commercialeId,
          ...(appuntamento.invitati ?? []),
        ];
      } else {
        destinatariIds = [
          appuntamento.commercialeId,
          appuntamento.ownerId, // Aggiungi l'ownerId per inviare a chi ha creato l'appuntamento
          ...(appuntamento.invitati ?? []),
        ];
      }

      const emailRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: destinatariIds }),
      });

      const data = await emailRes.json();

      if (!emailRes.ok || !Array.isArray(data.emails)) {
        throw new Error('Errore nel recupero delle email dei commerciali');
      }

      const emailsCommerciali = data.emails.filter(Boolean); // Filtra email nulle o vuote

      // 2. Prepara i dati comuni
      const start = new Date(orario[0]);
      const end = new Date(orario[orario.length - 1]);
      end.setMinutes(end.getMinutes() + 30);
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedTime = `${pad(start.getHours())}:${pad(start.getMinutes())} - ${pad(end.getHours())}:${pad(end.getMinutes())}`;
      const formattedDate = start.toLocaleDateString('it-IT');

      // 3. Prepara Email per il Cliente
      const htmlCliente = `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${cliente.nome ?? ''} ${cliente.cognome ?? ''},</p>
        <p>This is to confirm your appointment scheduled as follows:</p>
        <ul>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Time:</strong> ${formattedTime}</li>
          <li><strong>Representative:</strong> ${commerciale.name ?? ''} ${commerciale.cognome ?? ''}</li>
        </ul>
        <p>Best regards,<br/>
        ${commerciale.name ?? ''} ${commerciale.cognome ?? ''}
        </p>
      `;

      const promiseCliente = fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: [cliente.email],
          subject: 'ZEGNA BARUFFA LANE BORGOSESIA - Conferma Appuntamento / Appointment confirmation PITTI FILATI',
          html: htmlCliente,
        }),
      });

      // 4. Prepara Email per i Commerciali
      const htmlCommerciale = `
        <h2>Dettagli Appuntamento Fiera</h2>
        <p>È stato confermato un appuntamento:</p>
        <ul>
          <li><strong>Cliente:</strong> ${cliente.nome ?? ''} ${cliente.cognome ?? ''}</li>
          <li><strong>Email Cliente:</strong> ${cliente.email ?? 'N/D'}</li>
          <li><strong>Azienda:</strong> ${cliente.azienda ?? 'N/D'}</li>
          <li><strong>Ruolo:</strong> ${cliente.ruolo ?? 'N/D'}</li>
          <li><strong>Data:</strong> ${formattedDate}</li>
          <li><strong>Orario:</strong> ${formattedTime}</li>
          <li><strong>Commerciale Principale:</strong> ${commerciale.name ?? ''} ${commerciale.cognome ?? ''}</li>
          ${appuntamento.note ? `<li><strong>Note:</strong> ${appuntamento.note}</li>` : ''}
        </ul>
        <p>Questo è un promemoria automatico.</p>
      `;

      const promises = [promiseCliente];

      // Aggiungi la promise per i commerciali solo se ci sono destinatari
      if (emailsCommerciali.length > 0) {
        const promiseCommerciale = fetch('/api/sendMail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: emailsCommerciali,
            subject: `ZEGNA BARUFFA: Dettagli Appuntamento Fiera - ${cliente.azienda ?? cliente.nome}`,
            html: htmlCommerciale,
          }),
        });
        promises.push(promiseCommerciale);
      } else {
        console.log("Nessuna email commerciale interna da inviare.");
      }

      // 5. Invia entrambe le email in parallelo
      const results = await Promise.all(promises);

      // 6. Controlla i risultati
      const allOk = results.every(res => res.ok);

      if (allOk) {
        setToast({ message: t('emailInviata'), type: 'success' });
        console.log('Invio email a cliente:', [cliente.email]);
        if(emailsCommerciali.length > 0) {
          console.log('Invio email a commerciali:', emailsCommerciali);
        }
      } else {
        // Logga quale email ha fallito
        results.forEach((res, index) => {
          if (!res.ok) {
            const target = index === 0 ? 'cliente' : 'commerciali';
            console.error(`Errore invio email a ${target}`, res.status, res.statusText);
          }
        });
        throw new Error('Errore: almeno una email non è stata inviata.');
      }

    } catch (error) {
      console.error(error);
      setToast({ message: t('errInvioEmail'), type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <>
      {/* Modale dettagli appuntamento */}
      <Dialog open={true} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl space-y-4">
            <div className='flex justify-between items-center'>
              <Dialog.Title className="text-lg font-semibold">{t('dettapp')}</Dialog.Title>
              <button onClick={() => setShowConfirm(true)} className="text-red-600 hover:text-red-800">
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
            <div className='text-sm'>
              <p className='flex gap-x-2 mb-3 items-center'>
                <PiUserLight className="text-primary text-lg" />
                <span className='font-semibold'>{t('cliente')}:</span> {cliente.nome} {cliente.cognome}
              </p>
              {cliente.email && (
                <p className='flex gap-x-2 mb-3 items-center'>
                   <TfiEmail className="text-primary text-lg" />
                  <span className='font-semibold'>Email:</span> {cliente.email}
                </p>
              )}
              {cliente.azienda && (
                <p className='flex gap-x-2 mb-3 items-center'>
                  <PiBuildingsLight className="text-primary text-lg" />
                  <span className='font-semibold'>{t('azienda')}:</span> {cliente.azienda}
                </p>
              )}
              {cliente.ruolo && (
                <p className='flex gap-x-2 mb-3 items-center'>
                  <PiBriefcaseLight className="text-primary text-lg" />
                  <span className='font-semibold'>{t('ruolo')}:</span> {cliente.ruolo}
                </p>
              )}
              {/* <p className='flex gap-x-2 mb-3 items-center'>
                <FaBuildingUser className="text-primary text-lg" />
                <span className='font-semibold'>{t('commerciale')}:</span> {commerciale.name} {commerciale.cognome}
              </p> */}
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
              {altCommercialeName && (
                <p className='flex gap-x-2 mb-3 items-center'>
                  <CiUser className="text-primary text-lg" />
                  <span className='font-semibold'>{t('invitatoda')}:</span> {altCommercialeName}
                </p>
              )}
{invitati.length > 0 && (
  <div className="mb-3">
    <p className="flex gap-x-2 items-center text-sm font-semibold">
    {t('invitati')}:
    </p>
    <ul className="ml-4 text-sm list-disc">
      {invitati.map((inv) => (
        <li key={inv.id}>{inv.name} {inv.cognome}</li>
      ))}
    </ul>
  </div>
)}
              {appuntamento.note && (
                <p className='flex gap-x-2 mb-3 items-center'>
                <PiNoteBlankLight className="text-primary text-lg" />
                <span className='font-semibold'>{t('note')}:</span>
              
              
                <span className='block p-2 border border-1 rounded-xl mb-3'>{appuntamento.note}</span>
              </p>)}

            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={handleSendEmail}
                disabled={isSending}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
              >
                {isSending ? t('invioInCorso') : t('inviaEmail')}
              </button>
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

      {/* Modale conferma eliminazione */}
      {showConfirm && (
        <Dialog open={true} onClose={() => setShowConfirm(false)} className="relative z-50">
          <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl space-y-4">
              <Dialog.Title className="text-lg font-semibold">{t('confermaEliminazione')}</Dialog.Title>
              <p>{t('seiSicuroEliminare')}</p>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border rounded"
                >
                  {t('annulla')}
                </button>
                <button
                  onClick={handleDeleteAppuntamento}
                  disabled={isDeleting}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? t('eliminazioneInCorso') : t('conferma')}
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-2 rounded shadow-lg text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}
    </>
  );
};