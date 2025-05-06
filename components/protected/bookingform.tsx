import React from 'react'
import { useTranslation } from "@/lib/useTranslation";

const bookingform = () => {
  const { t } = useTranslation();

    const handleSubmit = (e:any) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())
        console.log(data)
      }

  return (
    <div className='grid grid-cols-2 rounded-xl shadow-md"'>
            <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="nome">{t('nome')}</label>
        <input type="text" name="nome" id="nome" />
      </div>

      <div>
        <label htmlFor="cognome">{t('cognome')}</label>
        <input type="text" name="cognome" id="cognome" />
      </div>

      <div>
        <label htmlFor="telefono">{t('telefono')}</label>
        <input type="tel" name="telefono" id="telefono" />
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input type="email" name="email" id="email" required />
      </div>

      <div>
        <label htmlFor="azienda">{t('azienda')}</label>
        <input type="text" name="azienda" id="azienda" />
      </div>

      <div>
        <label htmlFor="ruolo">{t('ruolo')}</label>
        <input type="text" name="ruolo" id="ruolo" />
      </div>

      <button type="submit">{t('invia')}</button>
    </form>
    </div>
  )
}

export default bookingform