'use client';

export default function Soporte() {
  return (
    <div className="max-w-4xl mx-auto px-10 py-20 text-center">
      <h1 className="text-5xl font-black tracking-tighter uppercase mb-6">Soporte <span className="text-blue-600">Técnico</span></h1>
      <p className="text-gray-500 font-mono text-sm tracking-widest mb-12 uppercase">Asistencia especializada para tu RAVA en Cuba</p>
      
      <div className="bg-[#0a0a0a] border border-white/5 p-12 rounded-[3rem] shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          <div>
            <h3 className="text-blue-500 font-bold uppercase text-[10px] tracking-widest mb-4">Contacto Directo</h3>
            <p className="text-2xl font-bold mb-2">WhatsApp Soporte</p>
            <p className="text-gray-400 text-sm">Disponibles de Lunes a Viernes para consultas mecánicas y eléctricas.</p>
          </div>
          <div className="flex items-center justify-center">
            <button className="bg-green-600 w-full py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all">
              Chatear ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}