import Image from "next/image";

export default function ManutenzionePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 text-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6">
        <Image src="/logo-black.svg" width={120} height={120} alt="Logo" className="object-contain mb-4" />
        <h1 className="text-3xl font-bold text-gray-800">Sito in Manutenzione</h1>
        <p className="text-gray-600">
          La piattaforma è attualmente offline per un aggiornamento programmato.<br /><br />
          Torneremo operativi a breve. Ci scusiamo per il disagio.
        </p>
      </div>
    </div>
  );
}
