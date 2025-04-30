// 'use client';

// import React from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils'; // opzionale per gestire classNames dinamici

// type Props = {
//   open: boolean;
//   onClose: () => void;
//   userId: string;
// };

// const COLORS = [
//   '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA',
//   '#F472B6', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
// ];

// export const ColoreSelezioneModal: React.FC<Props> = ({ open, onClose, userId }) => {
//   const handleColorSelect = async (color: string) => {
//     try {
//       const res = await fetch('/api/calendario/colore', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ userId, color }),
//       });

//       if (!res.ok) throw new Error();

//       toast.success('Colore aggiornato!');
//       onClose();
//     } catch (err) {
//       toast.error('Errore nel salvataggio');
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="bg-neutral">
//         <DialogHeader>
//           <DialogTitle>Seleziona un colore</DialogTitle>
//         </DialogHeader>
//         <div className="grid grid-cols-5 gap-4 mt-4">
//           {COLORS.map((color) => (
//             <button
//               key={color}
//               className="rounded-lg w-full h-16 flex items-center justify-center text-sm font-semibold"
//               style={{ backgroundColor: color, color: '#fff' }}
//               onClick={() => handleColorSelect(color)}
//             >
//               {color}
//             </button>
//           ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  onColorChange?: (color: string) => void; 
};

const COLORS = [
  '#F87171', '#FBBF24', '#34D399', '#60A5FA', '#A78BFA',
  '#F472B6', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
];

export const ColoreSelezioneModal: React.FC<Props> = ({
  open,
  onClose,
  userId,
  onColorChange,
}) => {
  const handleColorSelect = async (color: string) => {
    try {
      const res = await fetch('/api/calendario/colore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, color }),
      });

      if (!res.ok) throw new Error();

      toast.success('Colore aggiornato!');
      onColorChange?.(color); 
      onClose();
    } catch (err) {
      toast.error('Errore nel salvataggio');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral">
        <DialogHeader>
          <DialogTitle>Seleziona un colore</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-5 gap-4 mt-4">
          {COLORS.map((color) => (
            <button
              key={color}
              className="rounded-lg w-full h-16 flex items-center justify-center text-sm font-semibold"
              style={{ backgroundColor: color, color: '#fff' }}
              onClick={() => handleColorSelect(color)}
            >
              {color}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
