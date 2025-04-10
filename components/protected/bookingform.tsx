import React from 'react'

const bookingform = () => {

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
        <label htmlFor="nome">Nome</label>
        <input type="text" name="nome" id="nome" />
      </div>

      <div>
        <label htmlFor="cognome">Cognome</label>
        <input type="text" name="cognome" id="cognome" />
      </div>

      <div>
        <label htmlFor="telefono">Numero di Telefono</label>
        <input type="tel" name="telefono" id="telefono" />
      </div>

      <div>
        <label htmlFor="email">Email *</label>
        <input type="email" name="email" id="email" required />
      </div>

      <div>
        <label htmlFor="azienda">Azienda</label>
        <input type="text" name="azienda" id="azienda" />
      </div>

      <div>
        <label htmlFor="ruolo">Ruolo</label>
        <input type="text" name="ruolo" id="ruolo" />
      </div>

      <button type="submit">Invia</button>
    </form>
    </div>
  )
}

export default bookingform