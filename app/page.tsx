'use client';

import { useState } from 'react';
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

  const stats = [
    { valor: '+120', etiqueta: 'Sistemas instalados' },
    { valor: '99%', etiqueta: 'Uptime energético' },
    { valor: '24/7', etiqueta: 'Soporte técnico' },
    { valor: 'IA', etiqueta: 'Cálculo instantáneo' },
  ];

  return (
    <div className="pb-28">

      {/* ===================== HERO ===================== */}
      <section className="max-w-5xl mx-auto px-6 pt-20 md:pt-28 text-center">
        <div className="flex justify-center mb-8">
          <span className="chip">
            <span className="text-brand-soft">✦</span> Diseñador solar con IA — Nº1 en tu región
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-ink">
          Energía solar que{' '}
          <span className="text-brand-soft">nunca se apaga</span>
        </h1>

        <p className="mt-7 max-w-2xl mx-auto text-lg text-muted leading-relaxed">
          Diseña tu sistema fotovoltaico en segundos. Nuestra IA calcula inversor,
          paneles, cableado y autonomía a la medida exacta de tus equipos.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#configurador" className="btn-primary text-base">
            Calcular mi sistema
          </a>
          <Link href="/tienda" className="btn-ghost text-base">
            Explorar catálogo
          </Link>
        </div>

        {/* prueba social */}
        <div className="mt-10 flex items-center justify-center gap-3 text-sm text-muted">
          <div className="flex -space-x-2">
            {['#8b7bf7', '#6d5df0', '#a99bff', '#7c6bf5'].map((c, i) => (
              <span key={i} className="w-7 h-7 rounded-full border-2 border-base" style={{ background: c }} />
            ))}
          </div>
          <span>
            <span className="text-brand-soft">★★★★★</span> +120 clientes con energía sin cortes
          </span>
        </div>
      </section>

      {/* ===================== STATS (tarjetas oscuras) ===================== */}
      <section className="max-w-6xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.etiqueta} className="card p-6 flex flex-col gap-1 hover:border-brand/40 transition-colors">
              <span className="text-3xl font-extrabold text-ink">{s.valor}</span>
              <span className="text-sm text-muted">{s.etiqueta}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== CONFIGURADOR ===================== */}
      <section id="configurador" className="max-w-6xl mx-auto px-6 mt-24 scroll-mt-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Configura tu <span className="text-brand-soft">carga</span>
          </h2>
          <p className="mt-4 text-muted max-w-xl mx-auto">
            Selecciona tus equipos y deja que la IA dimensione tu sistema ideal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Lista de equipos */}
          <div className="card p-6 md:p-8">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-6">Equipos a alimentar</h3>
            <div className="space-y-3">
              {tablaCargas.map((equipo) => (
                <div key={equipo.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-panel-2/60 p-4">
                  <div className="min-w-0">
                    <h4 className="text-sm font-medium text-ink truncate">{equipo.nombre}</h4>
                    <span className="text-xs text-muted">{equipo.watts} W</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button onClick={() => ajustarCantidad(equipo.id, -1)} className="w-8 h-8 grid place-items-center rounded-lg border border-line text-muted hover:text-ink hover:border-brand/50 transition cursor-pointer">−</button>
                    <span className="w-6 text-center font-mono font-bold text-ink">{cantidades[equipo.id] ?? 0}</span>
                    <button onClick={() => ajustarCantidad(equipo.id, 1)} className="w-8 h-8 grid place-items-center rounded-lg border border-line text-muted hover:text-ink hover:border-brand/50 transition cursor-pointer">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel de resultados */}
          <div className="card p-6 md:p-8 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Análisis de la IA</h3>
              <span className="chip">en vivo</span>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand/15 to-transparent border border-brand/25 p-6 mb-6">
              <span className="text-sm text-muted">Consumo total</span>
              <div className="text-4xl font-extrabold text-ink mt-1">{wattsTotales.toLocaleString()} <span className="text-2xl text-brand-soft">W</span></div>
            </div>

            {kitRosen ? (
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-bold text-brand-soft">{kitRosen.base.nombre}</h4>

                <div className="rounded-2xl border border-line bg-panel-2/60 p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">⚡ Especificaciones</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span className="text-muted">Inversor</span> <span className="font-semibold text-ink">{kitRosen.inversor}</span></li>
                    <li className="flex justify-between"><span className="text-muted">Paneles</span> <span className="font-semibold text-ink">{kitRosen.paneles}</span></li>
                    <li className="flex justify-between"><span className="text-muted">Cable</span> <span className="font-semibold text-ink">{kitRosen.cable}</span></li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-line bg-panel-2/60 p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">📐 Instalación</h5>
                  <ul className="text-sm space-y-2">
                    <li className="flex justify-between"><span className="text-muted">Área de techo</span> <span className="font-semibold text-ink">{kitRosen.areaTecho}</span></li>
                    <li className="flex justify-between"><span className="text-muted">Peso aprox.</span> <span className="font-semibold text-ink">{kitRosen.peso}</span></li>
                    <li className="flex justify-between"><span className="text-muted">Autonomía</span> <span className="font-semibold text-ink">{kitRosen.autonomia}</span></li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-brand/25 bg-brand/10 p-5">
                  <h5 className="text-xs font-semibold uppercase tracking-wider text-brand-soft mb-2">💡 Consejo técnico</h5>
                  <p className="text-sm leading-relaxed text-ink/90">{kitRosen.consejo}</p>
                </div>

                {kitRosen.notaAdicional && (
                  <div className="rounded-2xl border border-line bg-panel-2/60 p-5">
                    <h5 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">ℹ️ Información importante</h5>
                    <p className="text-sm leading-relaxed text-ink/80">{kitRosen.notaAdicional}</p>
                  </div>
                )}

                <button onClick={enviarAWhatsApp} className="w-full text-sm text-brand-soft hover:text-brand font-medium py-2 transition-colors cursor-pointer">
                  Enviar este análisis por WhatsApp →
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted mb-6 leading-relaxed">
                Selecciona tus cargas y pulsa calcular para recibir una recomendación
                técnica generada por IA.
              </p>
            )}

            <button onClick={consultarIA} disabled={cargandoIA} className="btn-primary w-full text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {cargandoIA ? "Analizando con IA…" : "Calcular sistema ⚡"}
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
