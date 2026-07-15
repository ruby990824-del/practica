'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    tarjeta: '',
    expiracion: '',
    cvv: ''
  });
  const [pagando, setPagando] = useState(false);
  const [pagoExitoso, setPagoExitoso] = useState(false);

  useEffect(() => {
    try {
      // INTENTA LEER LA CLAVE - Asegúrate de que coincida con tu Tienda
      const guardado = localStorage.getItem('carrito_detallado_motoparts');
      if (guardado) {
        setCarrito(JSON.parse(guardado));
      }
    } catch (error) {
      console.error("Error al cargar el carrito en checkout:", error);
    }
  }, []);

  const total = carrito.reduce((acc, item) => acc + Number(item.precio) * (Number(item.cantidad) || 1), 0);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const ejecutarPago = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Formulario enviado, procesando pago..."); // Ver en consola F12
    setPagando(true);

    try {
      setTimeout(() => {
        // --- GUARDAR EN EL HISTORIAL DE ÓRDENES ---
        const nuevaOrden = {
          idOrden: 'RAVA-' + Math.floor(100000 + Math.random() * 900000),
          fecha: new Date().toLocaleDateString('es-ES'),
          productos: carrito,
          total: total
        };

        const historialGuardado = localStorage.getItem('historial_ordenes_motoparts');
        let historialActual = historialGuardado ? JSON.parse(historialGuardado) : [];
        historialActual.unshift(nuevaOrden);

        localStorage.setItem('historial_ordenes_motoparts', JSON.stringify(historialActual));
        // ------------------------------------------

        // Limpiar el carrito usado
        localStorage.removeItem('carrito_detallado_motoparts');
        
        // Avisar al layout
        window.dispatchEvent(new Event('carrito-actualizado'));
        
        setPagando(false);
        setPagoExitoso(true);
      }, 2000);

    } catch (error) {
      console.error("Error crítico al procesar el pago:", error);
      setPagando(false);
    }
  };

  if (pagoExitoso) {
    return (
      <div className="w-full min-h-screen bg-[#0a0c14] flex flex-col items-center justify-center text-white px-6">
        <div className="w-16 h-16 bg-emerald-600/20 border border-emerald-500 rounded-full flex items-center justify-center mb-6 text-emerald-400 text-2xl animate-bounce">
          ✓
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">¡Pago Procesado Fino!</h1>
        <p className="text-gray-400 text-sm mb-8 text-center max-w-sm">
          Tu orden ha sido validada por la pasarela de débito.
        </p>
        <Link href="/perfil" className="bg-blue-600 hover:bg-blue-700 text-xs font-black uppercase tracking-widest py-4 px-8 rounded-2xl transition-all">
          Ver Mi Historial de Órdenes →
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] pt-28 pb-20 text-white font-sans">
      <div className="max-w-[1100px] mx-auto px-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-12">Finalizar Compra</h1>

        {carrito.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 font-mono text-sm uppercase mb-6">El carrito está vacío o no se ha leído bien</p>
            <Link href="/tienda" className="text-blue-500 hover:underline text-xs font-bold uppercase tracking-wider">
              ← Ir a buscar repuestos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* FORMULARIO DE PAGO */}
            <form onSubmit={ejecutarPago} className="lg:col-span-7 bg-[#11131e] border border-white/5 rounded-[2.5rem] p-8 space-y-6">
              <h2 className="text-lg font-bold uppercase tracking-wider text-blue-500 mb-4">Información de Pago</h2>
              
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500">Nombre Completo</label>
                <input 
                  type="text" name="nombre" value={formulario.nombre} onChange={manejarCambio} required
                  className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500">Correo Electrónico</label>
                <input 
                  type="email" name="correo" value={formulario.correo} onChange={manejarCambio} required
                  className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="juan@correo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-gray-500">Número de Tarjeta (Visa Debit)</label>
                <input 
                  type="text" name="tarjeta" maxLength={16} value={formulario.tarjeta} onChange={manejarCambio} required
                  className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 transition-colors text-white"
                  placeholder="4000123456789010"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-500">Expiración</label>
                  <input 
                    type="text" name="expiracion" maxLength={5} value={formulario.expiracion} onChange={manejarCambio} required
                    className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-center focus:outline-none focus:border-blue-500 transition-colors text-white"
                    placeholder="MM/AA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase text-gray-500">CVV</label>
                  <input 
                    type="password" name="cvv" maxLength={3} value={formulario.cvv} onChange={manejarCambio} required
                    className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-center focus:outline-none focus:border-blue-500 transition-colors text-white"
                    placeholder="•••"
                  />
                </div>
              </div>

              <button 
                type="submit" disabled={pagando}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)] transition-all duration-300"
              >
                {pagando ? 'Verificando con Visa...' : `Autorizar Pago Neto • $${total}`}
              </button>
            </form>

            {/* RESUMEN DEL PEDIDO */}
            <div className="lg:col-span-5 bg-[#11131e]/50 border border-white/5 rounded-[2.5rem] p-8">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-400 mb-6">Tu Pedido</h2>
              
              <div className="divide-y divide-white/5 max-h-[280px] overflow-y-auto pr-2 space-y-4 mb-6">
                {carrito.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center pt-4 first:pt-0">
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-tight">{item.nombre}</h4>
                      <p className="text-xs text-gray-500 font-mono">Cant: {item.cantidad || 1}</p>
                    </div>
                    <span className="text-sm font-mono font-bold">${item.precio * (item.cantidad || 1)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-6 flex justify-between items-baseline">
                <span className="text-xs font-mono uppercase text-gray-500">Total a pagar</span>
                <span className="text-3xl font-black font-mono text-white">${total}</span>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}