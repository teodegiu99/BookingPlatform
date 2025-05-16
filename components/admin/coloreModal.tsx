'use client';
import { useTranslation } from "@/lib/useTranslation";
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
    '#DC2626', '#E11D48', '#BE185D', '#DB2777', '#D946EF',
    '#C026D3', '#9333EA', '#7C3AED', '#4C1D95', '#A78BFA', 
    '#8B5CF6', '#1D4ED8', '#2563EB', '#60A5FA', '#3B82F6',
    '#0EA5E9', '#0F766E', '#14B8A6', '#34D399', '#10B981',
    '#059669', '#15803D', '#65A30D', '#CA8A04', '#D97706',
    '#F59E0B', '#EA580C', '#FBBF24', '#F87171', '#F472B6'
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

      toast.success(t('colagg'));
      onColorChange?.(color); 
      onClose();
    } catch (err) {
      toast.error(t('colerr'));
    }
  };
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-neutral">
        <DialogHeader>
          <DialogTitle>{t('selcol')}</DialogTitle>
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
