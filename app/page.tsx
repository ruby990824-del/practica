'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Inicio() {
  const [cargandoIA, setCargandoIA] = useState(false);
  const [kitRosen, setKitRosen] = useState<any>(null);

  const tablaCargas = [
    { id: 'split', nombre: 'Aire Acondicionado / Split (1 Ton)', watts: 1200 },
    { id: 'freidora', nombre: 'Freidora Eléctrica (Comercial)', watts: 2000 },
    { id: 'horno', nombre: 'Horno de Convección / Panadería', watts: 2500 },
    { id: 'congelador', nombre: 'Congelador Horizontal (Exhibidor)', watts: 400 },
    { id: 'refrigerador', nombre: 'Refrigerador Moderno Inverter', watts: 200 },
    { id: 'refrigerador_viejo', nombre: 'Refrigerador Viejo (No Inverter)', watts: 450 },
    { id: 'bomba', nombre: 'Bomba de Agua (1 HP)', watts: 756 },
    { id: 'microondas', nombre: 'Horno Microondas', watts: 1200 },
    { id: 'pc_oficina', nombre: 'Computadora de Escritorio / PC', watts: 250 },
    { id: 'televisor', nombre: 'Televisor LED + Decodificador', watts: 100 },
    { id: 'bombillos', nombre: 'Iluminación General (LED x5)', watts: 50 },
    { id: 'ventilador', nombre: 'Ventilador de Pedestal', watts: 75 },
  ];

  const [cantidades, setCantidades] = useState<{ [key: string]: number }>({
    split: 0, freidora: 0, horno: 0, congelador: 0, refrigerador: 0, 
    refrigerador_viejo: 0, bomba: 0, microondas: 0, pc_oficina: 0, 
    televisor: 0, bombillos: 0, ventilador: 0,
  });

  const ajustarCantidad = (id: string, incremento: number) => {
    setCantidades(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + incremento) }));
  };

  const wattsTotales = tablaCargas.reduce((acc, eq) => acc + ((cantidades[eq.id] || 0) * eq.watts), 0);

  const consultarIA = async () => {
    if (wattsTotales === 0) {
      alert("Por favor, selecciona al menos un equipo.");
      return;
    }
    setCargandoIA(true);
    setKitRosen(null);
    try {
      const res = await fetch('/api/gemini-consultor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cargas: cantidades, totalWatts: wattsTotales, equipos: tablaCargas }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (data && data.kw) {
        setKitRosen({ ...data, base: { nombre: `Sistema Rosen ${data.kw}` } });
      } else {
        alert("La respuesta de la IA no pudo ser procesada.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el análisis.");
    } finally {
      setCargandoIA(false);
    }
  };

  const enviarAWhatsApp = () => {
    if (!kitRosen) return;
    const mensaje = `⚡ *PROPUESTA TÉCNICA RR ENERGÍA* ⚡\n\n*Sistema:* ${kitRosen.base.nombre}\n*Inversor:* ${kitRosen.inversor}\n*Paneles:* ${kitRosen.paneles}\n*Cable:* ${kitRosen.cable}\n\n*Consejo:* ${kitRosen.consejo}`;
    window.open(`https://api.whatsapp.com/send?phone=+5353863297&text=${encodeURIComponent(mensaje)}`, '_blank');
  };

  return (
    <div className="min-h-screen pb-20 font-sans bg-transparent text-inherit">
      <section className="max-w-7xl mx-auto px-6 pt-12">
        <div className="relative h-[500px] rounded-[3.5rem] overflow-hidden border shadow-2xl bg-white dark:bg-[#131622]">
          <div className="relative z-20 h-full flex flex-col justify-center px-12 md:px-24">
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10 text-gray-900 dark:text-white">
              POTENCIA SIN <br/> <span className="italic text-blue-600 dark:text-[#ff9900]">INTERRUPCIONES.</span>
            </h1>
            <Link href="/tienda" className="w-fit bg-[#990000] text-white px-12 py-5 rounded-[1.5rem] font-bold uppercase text-[11px] tracking-widest">
              Explorar Catálogo
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="border rounded-[3.5rem] p-8 md:p-12 shadow-2xl bg-white border-gray-200 dark:bg-[#131622] dark:border-white/5">
          <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-10">Configurador de Carga</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-3">
              {tablaCargas.map((equipo) => (
                <div key={equipo.id} className="flex items-center justify-between border rounded-[2rem] p-5 bg-[#f8f9fa] dark:bg-[#07090e]">
                  <h4 className="text-xs font-black uppercase">{equipo.nombre}</h4>
                  <div className="flex items-center gap-4">
                    <button onClick={() => ajustarCantidad(equipo.id, -1)} className="w-8 h-8 border rounded-xl">-</button>
                    <span className="font-mono font-black">{cantidades[equipo.id] ?? 0}</span>
                    <button onClick={() => ajustarCantidad(equipo.id, 1)} className="w-8 h-8 border rounded-xl">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border rounded-[2.5rem] p-8 bg-[#f8f9fa] dark:bg-[#07090e]">
              <h3 className="text-[10px] font-black uppercase mb-6">Resultados de la IA</h3>
              <div className="text-2xl font-black mb-6">{wattsTotales} W</div>
              {kitRosen ? (
                <div className="space-y-6 border-t pt-6 mb-6">
                  <div>
                    <h4 className="text-xl font-black uppercase italic text-blue-600 dark:text-[#ff9900]">{kitRosen.base.nombre}</h4>
                  </div>
                  
                  {/* Especificaciones técnicas */}
                  <div className="bg-white dark:bg-[#131622] rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-black uppercase text-gray-600 dark:text-gray-400 mb-3">⚡ ESPECIFICACIONES TÉCNICAS</h5>
                    <ul className="text-xs space-y-2 font-mono">
                      <li className="flex justify-between"><span>Inversor:</span> <span className="font-bold">{kitRosen.inversor}</span></li>
                      <li className="flex justify-between"><span>Paneles:</span> <span className="font-bold">{kitRosen.paneles}</span></li>
                      <li className="flex justify-between"><span>Cable:</span> <span className="font-bold">{kitRosen.cable}</span></li>
                    </ul>
                  </div>

                  {/* Información de instalación */}
                  <div className="bg-white dark:bg-[#131622] rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-black uppercase text-gray-600 dark:text-gray-400 mb-3">📐 INSTALACIÓN</h5>
                    <ul className="text-xs space-y-2 font-mono">
                      <li className="flex justify-between"><span>Área de techo:</span> <span className="font-bold">{kitRosen.areaTecho}</span></li>
                      <li className="flex justify-between"><span>Peso aprox:</span> <span className="font-bold">{kitRosen.peso}</span></li>
                      <li className="flex justify-between"><span>Autonomía:</span> <span className="font-bold">{kitRosen.autonomia}</span></li>
                    </ul>
                  </div>

                  {/* Consejos */}
                  <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <h5 className="text-xs font-black uppercase text-blue-900 dark:text-blue-300 mb-2">💡 CONSEJO TÉCNICO</h5>
                    <p className="text-xs leading-relaxed text-blue-800 dark:text-blue-200 italic">{kitRosen.consejo}</p>
                  </div>

                  {/* Nota adicional */}
                  {kitRosen.notaAdicional && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                      <h5 className="text-xs font-black uppercase text-amber-900 dark:text-amber-300 mb-2">ℹ️ INFORMACIÓN IMPORTANTE</h5>
                      <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">{kitRosen.notaAdicional}</p>
                    </div>
                  )}

                  <button onClick={enviarAWhatsApp} className="w-full text-[9px] underline text-[#990000] font-bold py-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition">Enviar este análisis a WhatsApp 📲</button>
                </div>
              ) : (
                <p className="text-xs opacity-50 mb-8 italic">Selecciona tus cargas y presiona calcular para recibir una recomendación experta.</p>
              )}
              <button onClick={consultarIA} disabled={cargandoIA} className="w-full bg-[#990000] text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase hover:bg-black transition-all">
                {cargandoIA ? "ANALIZANDO CON IA..." : "CALCULAR SISTEMA 🚀"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}