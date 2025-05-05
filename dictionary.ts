export const dictionary = {
    it: {
      calendario: 'Calendario',
      appuntamento: 'Appuntamento',
      salva: 'Salva',
      chiudi: 'Chiudi',
    },
    en: {
      calendario: 'Calendar',
      appuntamento: 'Appointment',
      salva: 'Save',
      chiudi: 'Close',
    },
  } as const;
  
  export type TranslationKey = keyof typeof dictionary['it'];