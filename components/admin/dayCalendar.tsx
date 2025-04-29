'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AppuntamentoModal } from './appuntamentoModale';
import { CreaAppuntamentoModal } from './creaAppuntamento';
import { ColoreSelezioneModal } from './coloreModal';

const hours = Array.from({ length: 20 }, (_, i) => 9 + i / 2);
const formatHour = (h: number) => `${Math.floor(h)}:${h % 1 === 0 ? '00' : '30'}`;

type Appuntamento = {
  id: string;
  orario: string[];
  cliente: {
    nome: string | null;
    cognome: string | null;
    email?: string | null;
    azienda?: string | null;
    ruolo?: string | null;
    telefono?: string | null;
  };
  commerciale: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

type Commerciale = {
  id: string;
  name: string | null;
  image: string | null;
  color: string | null;
};

type Props = {
  commerciali: Commerciale[];
  appuntamenti: Appuntamento[];
};

const isSameDay = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

const formatAppointmentHour = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours()}:${d.getMinutes() === 0 ? '00' : '30'}`;
};

export const DayCalendar: React.FC<Props> = ({ commerciali, appuntamenti }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppuntamento, setSelectedAppuntamento] = useState<Appuntamento | null>(null);
  const [colorModalOpen, setColorModalOpen] = useState(false);
const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [showCreaModal, setShowCreaModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    commercialeId: string;
    startTime: string;
  } | null>(null);
  const [slotToCreate, setSlotToCreate] = useState<{
    commercialeId: string;
    startHour: string;
  } | null>(null);


  const filtered = appuntamenti.filter((a) =>
    a.orario.some((slot) => isSameDay(new Date(slot), selectedDate))
  );

  const changeDay = (days: number) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  const isSlotOccupied = (commercialeId: string, hour: string) => {
    return filtered.some(
      (a) =>
        a.commerciale.id === commercialeId &&
        a.orario.some(
          (o) =>
            isSameDay(new Date(o), selectedDate) &&
            formatAppointmentHour(o) === hour
        )
    );
  };

 return (
  <>
    {/* Header con navigazione giorno */}
    <div className="flex items-center justify-between mb-4 px-2">
      <button
        onClick={() => changeDay(-1)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        <FaArrowLeft />
      </button>

      <h2 className="text-lg font-semibold">
        {selectedDate.toLocaleDateString('it-IT', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </h2>

      <button
        onClick={() => changeDay(1)}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        <FaArrowRight />
      </button>
    </div>

    {/* Calendario orizzontale */}
    <div className="overflow-x-auto ">
      <div className="min-w-[1600px] grid grid-cols-[200px_repeat(20,_1fr)] border">
        {/* Colonna fissa Commerciale */}
        <div className="border-r bg-gray-100 p-2 font-bold text-sm">Commerciale</div>
        {hours.map((h, i) => (
          <div key={i} className="border-r text-xs text-center bg-gray-50 py-2 min-w-[80px]">
            {formatHour(h)}
          </div>
        ))}

        {/* Righe per ogni commerciale */}
        {commerciali.map((com) => (
          <React.Fragment key={com.id}>
            {/* Cellona profilo commerciale */}
            <div className="flex items-center gap-2 border-t border-r p-2 bg-gray-50">
              <Image
                src={com.image || '/placeholder.png'}
                alt={com.name || 'Commerciale'}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <button
  onClick={() => {
    setSelectedUserId(com.id);
    setColorModalOpen(true);
  }
}
  className="text-sm font-medium hover:underline focus:outline-none"
>
  {com.color}
  {com.name}
</button>
{selectedUserId && (
  <ColoreSelezioneModal
    open={colorModalOpen}
    onClose={() => setColorModalOpen(false)}
    userId={selectedUserId}
  />
)}
            </div>

            {/* Celle orarie */}
            {hours.map((h, i) => {
              const hourStr = formatHour(h);
              const occupied = filtered.find(
                (a) =>
                  a.commerciale.id === com.id &&
                  a.orario.some(
                    (o) =>
                      isSameDay(new Date(o), selectedDate) &&
                      formatAppointmentHour(o) === hourStr
                  )
              );

              return (
                <div
                  key={i}
                  className="relative border-t border-r h-16 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    if (occupied) {
                      setSelectedAppuntamento(occupied);
                    } else {
                      setSlotToCreate({ commercialeId: com.id, startHour: hourStr });
                    }
                  }}
                >
{occupied && (
  <div className="absolute bg-blue-600 text-white text-xs p-1 h-full w-full overflow-hidden rounded" style={{ backgroundColor: com.color || '#3B82F6' }}>
    <div className="font-semibold truncate">
      {occupied.cliente.nome} {occupied.cliente.cognome}
    </div>
    <div>
      {formatAppointmentHour(occupied.orario[0])}–{
        // calcolo orario di fine aggiungendo 30 minuti all’ultimo slot
        (() => {
          const last = new Date(occupied.orario[occupied.orario.length - 1]);
          last.setMinutes(last.getMinutes() + 30);
          return `${last.getHours()}:${last.getMinutes() === 0 ? '00' : '30'}`;
        })()
      }
    </div>
  </div>
)}

                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>

    {/* Modale dettaglio esistente */}
    {selectedAppuntamento && (
      <AppuntamentoModal
        // open={true}
        appuntamento={selectedAppuntamento}
        onClose={() => setSelectedAppuntamento(null)}
      />
    )}

    {/* Modale creazione nuovo slot */}
    {slotToCreate && (
      <CreaAppuntamentoModal
        open={true}
        onClose={() => setSlotToCreate(null)}
        commercialeId={slotToCreate.commercialeId}
        selectedDate={selectedDate}
        startHour={slotToCreate.startHour}
        appuntamenti={filtered} 
      />
    )}
  </>
);
};