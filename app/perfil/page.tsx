'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PerfilPage() {
  const [ordenes, setOrdenes] = useState<any[]>([]);

  useEffect(() => {
    const historial = localStorage.getItem('historial_ordenes_motoparts');
    if (historial) {
      setOrdenes(JSON.parse(historial));
    }
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] pt-28 pb-20 text-white font-sans">
      <div className="max-w-[900px] mx-auto px-6">
        
        {/* Encabezado del Perfil */}
        <div className="flex items-center gap-6 border-b border-white/5 pb-8 mb-12">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-xl font-black uppercase tracking-tighter">
            U
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Mi Panel RAVA</h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">Cliente Certificado</p>
          </div>
        </div>

        <h2 className="text-xl font-black uppercase italic tracking-tight mb-6 text-gray-400">
          Historial de Órdenes ({ordenes.length})
        </h2>

        {ordenes.length === 0 ? (
          <div className="bg-[#11131e] border border-white/5 rounded-[2rem] p-12 text-center">
            <p className="text-gray-500 font-mono text-xs uppercase mb-6">No has realizado ninguna compra todavía</p>
            <Link href="/tienda" className="bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all">
              Explorar Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {ordenes.map((orden) => (
              <div key={orden.idOrden} className="bg-[#11131e] border border-white/5 rounded-[2rem] p-6 lg:p-8 hover:border-white/10 transition-colors">
                
                {/* Cabecera de la Tarjeta de Orden */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-4 mb-4 gap-2">
                  <div>
                    <span className="text-xs font-mono text-blue-500 font-bold">{orden.idOrden}</span>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">Fecha de compra: {orden.fecha}</p>
                  </div>
                  <div className="text-right sm:text-right">
                    <span className="text-xs font-mono uppercase text-gray-500 block">Total Facturado</span>
                    <span className="text-xl font-mono font-black text-emerald-400">${orden.total}</span>
                  </div>
                </div>

                {/* Desglose de Productos comprados en esta orden */}
                <div className="space-y-3">
                  {orden.productos.map((prod: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm bg-[#161925]/50 border border-white/[0.02] rounded-xl p-3">
                      <div>
                        <h4 className="font-bold uppercase tracking-tight text-gray-300">{prod.nombre}</h4>
                        <span className="text-xs font-mono text-gray-500 uppercase">{prod.categoria || 'Repuesto'}</span>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="text-gray-500">{prod.cantidad || 1}x </span>
                        <span className="text-gray-400">${prod.precio}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}