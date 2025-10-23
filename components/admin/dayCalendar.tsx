'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AppuntamentoModal } from './appuntamentoModale';
import { CreaAppuntamentoModal } from './creaAppuntamento';
import { ColoreSelezioneModal } from './coloreModal';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { useTranslation } from "@/lib/useTranslation";

const hours = Array.from({ length: 20 }, (_, i) => 9 + i / 2);
const formatHour = (h: number) => {
  const hours = Math.floor(h).toString().padStart(2, '0');
  const minutes = h % 1 === 0 ? '00' : '30';
    return `${hours}:${minutes}`;
  };

const nove = (h: number) => {
  const hours = Math.floor(h).toString().padStart(2, '0');
  return hours;
}; 
type Appuntamento = {
  id: string;
  orario: string[];
  note: string;
  ownerId: string; // <-- aggiornato campo
  commercialeId: string;
  invitati?: string[];  //forse rompo tutto
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
    cognome: string | null;
    image: string | null;
    color: string | null;
    societa: string | null;
  };
};

type Commerciale = {
  id: string;
  name: string | null;
  image: string | null;
  color: string | null;
  societa: string | null;
  cognome: string | null;
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
  // console.log(`${d.getHours()}:${d.getMinutes() === 0 ? '00' : '30'}`);
  return `${nove(d.getHours())}:${d.getMinutes() === 0 ? '00' : '30'}`;
};

export const DayCalendar: React.FC<Props> = ({ commerciali, appuntamenti }) => {
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppuntamento, setSelectedAppuntamento] = useState<Appuntamento | null>(null);
  const [slotToCreate, setSlotToCreate] = useState<{
    commercialeId: string;
    startHour: string;
  } | null>(null);

  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [commercialiState, setCommercialiState] = useState(commerciali);

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

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={() => changeDay(-1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaArrowLeft />
        </button>
        <div className="flex items-center gap-2">
          {/* qua da andare a modificare per aggiungere il multilingua per i giorni della settimana {t('orario')}*/}
          <h2 className="text-lg font-medium">
            {selectedDate.toLocaleDateString(t('ling'), {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date !== null) {
                setSelectedDate(date);
              }
            }}
            customInput={
              <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
                <FaCalendarAlt size={18} />
              </button>
            }
            popperPlacement="bottom"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <button
          onClick={() => changeDay(1)}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          <FaArrowRight />
        </button>
      </div>

      {/* Tabella calendario */}
      <div className="overflow-x-auto">


 <div className="min-w-[1600px] grid grid-cols-[200px_repeat(20,_1fr)] border-b sticky top-0 bg-white z-30">
    <div className="border-r bg-gray-100 p-2 font-semibold text-sm">
      {t('commerciale')}
    </div>
    {hours.map((h, i) => (
      <div key={i} className="border-r text-xs text-center bg-gray-50 py-2 min-w-[80px]">
        {formatHour(h)}
      </div>
    ))}
  </div>

      <div className="overflow-y-auto max-h-[80vh]">


        <div className="min-w-[1600px] grid grid-cols-[200px_repeat(20,_1fr)] border">
 


          {/* Riga per ogni commerciale */}
          {[...commercialiState]
            .sort((a, b) => {
              const aVal = (a.cognome || a.name || '').toLowerCase();
              const bVal = (b.cognome || b.name || '').toLowerCase();
              return aVal.localeCompare(bVal);
            })
            .map((com) => {
              const displayName = com.name?.charAt(0) ? com.name+ ' ' + com.cognome : com.cognome
                ? com.cognome.charAt(0).toUpperCase() + com.cognome.slice(1).toLowerCase()
                : (com.name ? com.name + com.name.slice(1).toLowerCase() : '');
              // const displayName = com.cognome? + " " +  com.name
              return (
                <React.Fragment key={com.id}>
                  {/* Colonna info commerciale */}
                  <div className="flex items-center gap-2 border-t border-r p-2 bg-gray-50">
      
                    <button
                      onClick={() => {
                        setSelectedUserId(com.id);
                        setColorModalOpen(true);
                      }}
                      className="text-sm font-regular hover:underline focus:outline-none flex flex-col items-start"
                    >
                      {com.societa && <span>{com.societa}</span>}
                      {displayName}
                    </button>
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
                          <div
                            className="absolute text-white text-xs p-1 h-full w-full overflow-hidden rounded"
                            style={{ backgroundColor: com.color || '#3B82F6' }}
                          >
                            <div className="font-medium truncate">
                              {occupied.cliente.azienda}<br className='gap-y-1'/>
                              {occupied.cliente.cognome}
                            </div>
                            <div>
                              {formatAppointmentHour(occupied.orario[0])}–
                              {(() => {
                                const last = new Date(occupied.orario[occupied.orario.length - 1]);
                                last.setMinutes(last.getMinutes() + 30);
                                return `${nove(last.getHours())}:${last.getMinutes() === 0 ? '00' : '30'}`;1
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
        </div>
      </div>
</div>
      {/* Modale appuntamento */}
      {selectedAppuntamento && (
        <AppuntamentoModal
          appuntamento={selectedAppuntamento}
          onClose={() => setSelectedAppuntamento(null)}
        />
      )}

      {/* Modale nuovo appuntamento */}
      {slotToCreate && (
        <CreaAppuntamentoModal
          open={true}
          onClose={() => setSlotToCreate(null)}
          commercialeId={slotToCreate.commercialeId}
          selectedDate={selectedDate.toISOString().split('T')[0]} // ✅ stringa: "2025-05-27"
          startHour={slotToCreate.startHour}
          appuntamenti={filtered}
        />
      )}

      {/* Modale colore */}
      {colorModalOpen && selectedUserId && (
        <ColoreSelezioneModal
          open={colorModalOpen}
          onClose={() => setColorModalOpen(false)}
          userId={selectedUserId}
          onColorChange={(newColor) => {
            setCommercialiState((prev) =>
              prev.map((c) =>
                c.id === selectedUserId ? { ...c, color: newColor } : c
              )
            );
          }}
        />
      )}
    </>
  );
};
