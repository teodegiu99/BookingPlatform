// components/DayCalendar.tsx
'use client';

import React from 'react';
import Image from 'next/image';

const hours = Array.from({ length: 20 }, (_, i) => 9 + i / 2); // dalle 9:00 alle 19:00 (9.0, 9.5, ..., 19.0)
const formatHour = (h: number) => {
  const hour = Math.floor(h);
  const minutes = h % 1 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
};

type Appuntamento = {
  id: string;
  cliente: {
    nome: string | null;
    cognome: string | null;
  };
  commerciale: {
    id: string;
    name: string;
    image: string | null;
  };
  orario: string[];
};

type Props = {
    commerciali: {
      id: string;
      name: string | null;
      image: string | null;
    }[];
    appuntamenti: {
      id: string;
      orario: string[];
      cliente: {
        nome: string | null;
        cognome: string | null;
      };
      commerciale: {
        id: string;
        name: string | null;
        image: string | null;
      };
    }[];
  };
  
export const DayCalendar: React.FC<Props> = ({ commerciali, appuntamenti }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[1500px] grid grid-cols-[200px_repeat(20,_1fr)] border">
        {/* Header ore */}
        <div className="border-r bg-gray-100 p-2 font-bold text-sm">Commerciale</div>
        {hours.map((h, i) => (
          <div key={i} className="border-r text-xs text-center bg-gray-50 py-2">
            {formatHour(h)}
          </div>
        ))}

        {/* Riga per ogni commerciale */}
        {commerciali.map((com) => (
          <React.Fragment key={com.id}>
            {/* Colonna commerciale */}
            <div className="flex items-center gap-2 border-t border-r p-2">
              <Image
                src={com.image || '/placeholder.jpg'}
                alt={com.name || 'Commerciale'}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="text-sm font-medium">{com.name}</span>
            </div>

            {/* Colonne slot orari */}
            {hours.map((h, i) => {
              const slotHour = formatHour(h);
              const slot = appuntamenti.find(
                (a) => a.commerciale.id === com.id && a.orario.includes(slotHour)
                          );

              return (
                <div key={i} className="relative border-t border-r h-16">
                  {slot && slot.orario[0] === slotHour && (
                    <div className="absolute inset-1 bg-blue-600 text-white text-xs rounded p-1">
                      {slot.cliente.nome} {slot.cliente.cognome}
                      <br />
                      {slot.orario.length > 1
                        ? `${slot.orario[0]} → ${slot.orario[slot.orario.length - 1]}`
                        : slot.orario[0]}
                    </div>
                  )} 
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
