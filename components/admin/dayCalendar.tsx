'use client';

import React, { useState, useMemo } from 'react'; // 1. Importato useMemo
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { AppuntamentoModal } from './appuntamentoModale';
import { CreaAppuntamentoModal } from './creaAppuntamento';
import { ColoreSelezioneModal } from './coloreModal';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import { useTranslation } from "@/lib/useTranslation";
import { useSession } from "next-auth/react"; 

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
  ownerId: string; 
  commercialeId: string;
  invitati?: string[];
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
  email: string | null; // 1. Aggiunto email
  multipleAppointment?: boolean; 
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
  return `${nove(d.getHours())}:${d.getMinutes() === 0 ? '00' : '30'}`;
};

export const DayCalendar: React.FC<Props> = ({ commerciali, appuntamenti }) => {
  const { t } = useTranslation();
  const { data: session } = useSession();
  // 2. Aggiunto email al cast della sessione
  const user = session?.user as { name?: string | null, cognome?: string | null, email?: string | null }; 

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppuntamento, setSelectedAppuntamento] = useState<Appuntamento | null>(null);
  const [slotToCreate, setSlotToCreate] = useState<{
    commercialeId: string;
    startHour: string;
  } | null>(null);

  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});

  const filtered = appuntamenti.filter((a) =>
    a.orario.some((slot) => isSameDay(new Date(slot), selectedDate))
  );

  // --- (FIX 1) PALETTE COLORI PER STACK ---
  // Colori usati per il 2°, 3°, 4° appuntamento ecc. nello stesso slot
  const stackedAppointmentColors = [
    '#10B981', // green-500
    '#EF4444', // red-500
    '#F59E0B', // amber-500
    '#8B5CF6', // violet-500
    '#EC4899', // pink-500
    '#64748B', // slate-500
  ];
  // --- FINE FIX 1 ---

  const changeDay = (days: number) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };

  // 3. Creiamo la lista ordinata e con i colori aggiornati usando useMemo
  const sortedCommerciali = useMemo(() => {
    
    // 3. (FIX) Dati utente normalizzati per EMAIL
    const userEmail = user?.email ? user.email.trim().toLowerCase() : null;

    // Applica prima gli override dei colori
    const listWithOverrides = commerciali.map(com => ({
      ...com,
      color: colorOverrides[com.id] || com.color, // Usa l'override se esiste
    }));

    // Poi ordina la lista
    listWithOverrides.sort((a, b) => {
        // --- Priorità 1: multipleAppointment ---
        const aHasMulti = a.multipleAppointment === true;
        const bHasMulti = b.multipleAppointment === true;

        if (aHasMulti && !bHasMulti) return -1; 
        if (!aHasMulti && bHasMulti) return 1;  
        
        // --- Priorità 2: Utente corrente (basata su email) ---
        const aEmail = a.email ? a.email.trim().toLowerCase() : null;
        const bEmail = b.email ? b.email.trim().toLowerCase() : null;

        let aIsUser = false;
        let bIsUser = false;
        
        if (user && userEmail) { // Confronta solo se l'utente è loggato E ha un'email
          aIsUser = (aEmail === userEmail);
          bIsUser = (bEmail === userEmail);
        }

        if (aIsUser && !bIsUser) return -1; 
        if (!aIsUser && bIsUser) return 1;  

        // --- Priorità 3: Ordine alfabetico ---
        const aVal = (a.cognome || a.name || '').toLowerCase();
        const bVal = (b.cognome || b.name || '').toLowerCase();
        return aVal.localeCompare(bVal);
    });
    
    return listWithOverrides;

  }, [commerciali, user, colorOverrides]); // Dipendenze: props, sessione, colori locali


  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
{/* ... (codice header invariato) ... */}
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
          {/* 4. Mappiamo la nuova lista memoizzata */}
          {sortedCommerciali.map((com) => {
              const displayName = com.name?.charAt(0) ? com.name+ ' ' + com.cognome : com.cognome
                ? com.cognome.charAt(0).toUpperCase() + com.cognome.slice(1).toLowerCase()
                : (com.name ? com.name + com.name.slice(1).toLowerCase() : '');
              
              return (
                <React.Fragment key={com.id}>
                  {/* Colonna info commerciale */}
                  <div className="flex items-center gap-2 border-t border-r p-2 bg-gray-50">
      
                    <button
                      onClick={() => {
                        setSelectedUserId(com.id); // Questo è corretto
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

                    // --- INIZIO MODIFICA: Da .find() a .filter() ---
                    const appointmentsInSlot = filtered.filter(
                      (a) =>
                        a.commerciale.id === com.id &&
                        a.orario.some(
                          (o) =>
                            isSameDay(new Date(o), selectedDate) &&
                            formatAppointmentHour(o) === hourStr
                        )
                    );

                    const canHaveMultiple = com.multipleAppointment === true;
                    // Lista di appuntamenti da mostrare (rispetta canHaveMultiple)
                    const displayAppointments = canHaveMultiple 
                      ? appointmentsInSlot 
                      : appointmentsInSlot.slice(0, 1); // Mostra solo il primo se multiple=false

                    const slotHasAppointments = displayAppointments.length > 0;
                    // --- FINE MODIFICA ---

                    return (
                      <div
                        key={i}
                        className="relative border-t border-r h-16 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          // Click sulla cella: apre sempre CREA (per aggiungere)
                          setSlotToCreate({ commercialeId: com.id, startHour: hourStr });
                        }}
                      >
                        {/* --- INIZIO MODIFICA RENDER --- */}

                        {/* Se 0 appuntamenti, non renderizza nulla (cella vuota) */}

                        {/* Caso 1: Un solo appuntamento (o multipli non permessi) */}
                        {slotHasAppointments && displayAppointments.length === 1 && (
                          <div
                            className="absolute text-white text-xs p-1 h-full w-full overflow-hidden rounded"
                            style={{ backgroundColor: com.color || '#3B82F6' }}
                            onClick={(e) => {
                              e.stopPropagation(); // Evita che si apra "Crea"
                              setSelectedAppuntamento(displayAppointments[0]);
                            }}
                          >
                            <div className="font-medium truncate">
                              {displayAppointments[0].cliente.azienda}<br className='gap-y-1'/>
                              {displayAppointments[0].cliente.cognome}
                            </div>
                            <div>
                              {formatAppointmentHour(displayAppointments[0].orario[0])}–
                              {(() => {
                                const last = new Date(displayAppointments[0].orario[displayAppointments[0].orario.length - 1]);
                                last.setMinutes(last.getMinutes() + 30);
                                return `${nove(last.getHours())}:${last.getMinutes() === 0 ? '00' : '30'}`;1
                              })()}
                            </div>
                          </div>
                        )}

                        {/* --- (FIX 2) Caso 2: Multipli appuntamenti (Logica Colori) --- */}
                        {slotHasAppointments && displayAppointments.length > 1 && (
                          <div className="flex flex-col h-full w-full overflow-hidden">
                            {displayAppointments.map((occupied, index) => {

                              // Il primo app (index 0) usa il colore del commerciale
                              // Gli altri usano la palette a rotazione
                              const bgColor = index === 0 
                                ? (com.color || '#3B82F6') 
                                : stackedAppointmentColors[(index - 1) % stackedAppointmentColors.length];

                              return (
                                <div
                                  key={occupied.id}
                                  className="text-white text-xs p-0.5 overflow-hidden rounded hover:brightness-125"
                                  style={{ 
                                    backgroundColor: bgColor, // <-- USA LA NUOVA LOGICA
                                    minHeight: `${100 / displayAppointments.length}%` // Divide l'altezza
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Evita che si apra "Crea"
                                    setSelectedAppuntamento(occupied);
                                  }}
                                >
                                  <div className="font-medium truncate">
                                    {occupied.cliente.azienda}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        {/* --- FINE FIX 2 --- */}
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
          selectedDate={selectedDate.toISOString().split('T')[0]} 
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
            // 6. Aggiorna solo lo stato degli override
            setColorOverrides(prev => ({
              ...prev,
              [selectedUserId]: newColor
            }));
          }}
        />
      )}
    </>
  );
};

