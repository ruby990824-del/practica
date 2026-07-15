'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const router = useRouter();
  const [carrito, setCarrito] = useState<any[]>([]);

  // Cargar los productos del carrito al montar la página
  useEffect(() => {
    const guardado = localStorage.getItem('carrito_detallado_motoparts');
    if (guardado) {
      setCarrito(JSON.parse(guardado));
    }
  }, []);

  // Función para remover un producto individual del carrito
  const removerProducto = (id: any) => {
    const nuevoCarrito = carrito.filter((item) => String(item.id) !== String(id));
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito_detallado_motoparts', JSON.stringify(nuevoCarrito));
    // Avisar al layout para que actualice el contador global en la barra de navegación
    window.dispatchEvent(new Event('carrito-actualizado'));
  };

  // Calcular el total estimado
  const totalEstimado = carrito.reduce((acc, item) => acc + (Number(item.precio) * (Number(item.cantidad) || 1)), 0);

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] pt-28 pb-20 text-white font-sans">
      <div className="max-w-[1000px] mx-auto px-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Tu Carrito</h1>

        {carrito.length === 0 ? (
          <div className="bg-[#11131e] border border-white/5 rounded-[2.5rem] p-12 text-center">
            <p className="text-gray-500 font-mono text-sm uppercase mb-6">No hay repuestos en el carrito</p>
            <Link href="/tienda" className="bg-blue-600 hover:bg-blue-700 text-xs font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all">
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* LISTA DE PRODUCTOS */}
            <div className="space-y-4">
              {carrito.map((item, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#11131e] border border-white/5 rounded-[2rem] p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors hover:border-white/10"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 block mb-1">
                      {item.categoria || 'Componente Original'}
                    </span>
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">
                      {item.nombre}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono mt-1">
                      Cantidad: {item.cantidad || 1} x ${item.precio}
                    </p>
                  </div>

                  <div className="w-full sm:w-auto flex justify-between sm:justify-end items-center gap-8">
                    <span className="text-xl font-mono font-black text-white">
                      ${item.precio * (item.cantidad || 1)}
                    </span>
                    <button 
                      onClick={() => removerProducto(item.id)}
                      className="text-red-500/80 hover:text-red-500 text-[10px] font-mono uppercase tracking-widest border border-red-500/20 hover:border-red-500/50 bg-red-500/5 px-4 py-2 rounded-xl transition-all"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* BARRA DE TOTAL Y ACCIÓN */}
            <div className="bg-[#11131e] border border-white/5 rounded-[2.5rem] p-8 flex flex-col sm:flex-row justify-between items-center gap-6 mt-12">
              <div className="text-center sm:text-left">
                <span className="text-xs font-mono uppercase text-gray-500 block mb-1">Total Estimado</span>
                <span className="text-4xl font-mono font-black text-emerald-500">
                  ${totalEstimado}
                </span>
              </div>

              {/* El botón verde con la navegación corregida */}
              <button 
                onClick={() => router.push('/checkout')}
                className="w-full sm:w-auto bg-[#00a86b] hover:bg-[#008f5d] text-white font-black uppercase tracking-widest text-xs py-5 px-12 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,168,107,0.3)] transition-all duration-300 active:scale-[0.98]"
              >
                Proceder al Pago
              </button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}