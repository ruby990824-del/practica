'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import Visor3d from '../../src/componentes/Visor3d';
import { obtenerFicha } from '../../src/componentes/especificaciones';

export default function DetalleProducto() {
  const params = useParams();
  const idProducto = params.id;

  const [producto, setProducto] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [agregado, setAgregado] = useState(false);
  const [vista, setVista] = useState<'3d' | 'foto'>('3d');
  const [pestana, setPestana] = useState<'descripcion' | 'caracteristicas' | 'especificaciones'>(
    'descripcion'
  );

  useEffect(() => {
    function cargarProducto() {
      try {
        // Misma fuente que la tienda: el catálogo global en localStorage
        const guardado = localStorage.getItem('catalogo_motoparts_global');
        const catalogo = guardado ? JSON.parse(guardado) : [];
        const encontrado = catalogo.find((p: any) => String(p.id) === String(idProducto));
        setProducto(encontrado || null);
      } catch (error) {
        console.error('Error cargando el detalle:', error);
      } finally {
        setCargando(false);
      }
    }
    if (idProducto) cargarProducto();
  }, [idProducto]);

  const manejarAñadirAlCarrito = () => {
    if (!producto) return;

    const actualGuardado = localStorage.getItem('carrito_detallado_motoparts');
    const carritoActual = actualGuardado ? JSON.parse(actualGuardado) : [];

    const existeIndex = carritoActual.findIndex((item: any) => String(item.id) === String(producto.id));

    if (existeIndex > -1) {
      carritoActual[existeIndex].cantidad = (carritoActual[existeIndex].cantidad || 1) + 1;
    } else {
      carritoActual.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        categoria: producto.categoria,
      });
    }

    localStorage.setItem('carrito_detallado_motoparts', JSON.stringify(carritoActual));
    window.dispatchEvent(new Event('carrito-actualizado'));

    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  if (cargando) {
    return (
      <div className="w-full min-h-screen bg-[#0a0c14] flex items-center justify-center text-gray-500 font-mono uppercase tracking-widest animate-pulse">
        Cargando especificaciones...
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="w-full min-h-screen bg-[#0a0c14] flex flex-col items-center justify-center text-white">
        <p className="text-xl font-bold uppercase tracking-wider mb-4 text-red-500">Componente no encontrado</p>
        <Link href="/tienda" className="text-blue-500 text-xs font-black uppercase tracking-widest hover:underline">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const ficha = obtenerFicha(producto);

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] py-20 text-white font-sans">
      <div className="max-w-[1200px] mx-auto px-6">
        <Link
          href="/tienda"
          className="text-blue-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors mb-12 inline-block"
        >
          ← Volver a la Tienda
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mt-6">
          {/* COLUMNA IZQUIERDA: Visor con conmutador 3D / Foto */}
          <div>
            <div className="w-full h-[450px] bg-[#161925] border border-white/5 rounded-[3.5rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none z-10" />

              {/* Etiqueta 360° */}
              {vista === '3d' && (
                <span className="absolute top-6 left-6 z-20 text-[10px] font-mono uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
                  ◎ Vista 360° · arrastra para rotar
                </span>
              )}

              {vista === '3d' ? (
                <Visor3d categoria={producto.categoria} />
              ) : producto.imagen ? (
                <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Sin foto de referencia
                </div>
              )}
            </div>

            {/* Conmutador de vista */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setVista('3d')}
                className={`flex-1 text-[11px] font-black uppercase tracking-widest py-3 rounded-2xl border transition-all ${
                  vista === '3d'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-[#11131e] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Visor 3D
              </button>
              <button
                onClick={() => setVista('foto')}
                className={`flex-1 text-[11px] font-black uppercase tracking-widest py-3 rounded-2xl border transition-all ${
                  vista === 'foto'
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-[#11131e] border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                Foto Real
              </button>
            </div>
          </div>

          {/* COLUMNA DERECHA: Datos y compra */}
          <div className="flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500 mb-2">
              {producto.categoria || 'Repuesto'} Original
            </span>

            <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none mb-6">
              {producto.nombre}
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              {producto.descripcion ||
                'Componente de alto rendimiento optimizado para la gestión de energía y estabilidad estructural en el ecosistema RAVA.'}
            </p>

            <div className="border-t border-b border-white/5 py-6 mb-8 flex items-baseline justify-between max-w-md">
              <span className="text-gray-500 text-xs font-mono uppercase">Precio Neto</span>
              <span className="text-4xl font-black tracking-tight text-white font-mono">${producto.precio}</span>
            </div>

            <button
              onClick={manejarAñadirAlCarrito}
              className={`w-full max-w-md font-black uppercase tracking-widest text-xs py-5 rounded-[2rem] transition-all duration-300 active:scale-[0.98] ${
                agregado
                  ? 'bg-emerald-600 text-white shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)]'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-[0_20px_40px_-10px_rgba(37,99,235,0.3)]'
              }`}
            >
              {agregado ? '¡Añadido Exitosamente! ✓' : 'Añadir al Carrito'}
            </button>
          </div>
        </div>

        {/* INFORMACIÓN ADICIONAL — pestañas estilo PC Componentes */}
        <div className="mt-20 bg-[#11131e] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="flex flex-wrap border-b border-white/5">
            {[
              { id: 'descripcion', nombre: 'Descripción' },
              { id: 'caracteristicas', nombre: 'Características' },
              { id: 'especificaciones', nombre: 'Especificaciones técnicas' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setPestana(tab.id as typeof pestana)}
                className={`px-8 py-5 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                  pestana === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.nombre}
                {pestana === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />}
              </button>
            ))}
          </div>

          <div className="p-8 md:p-12">
            {pestana === 'descripcion' && (
              <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                {producto.descripcion ||
                  `El ${producto.nombre} forma parte de la línea de repuestos originales RAVA, diseñada para ofrecer el máximo rendimiento y durabilidad dentro del ecosistema de movilidad eléctrica. Cada pieza pasa por controles de calidad de fábrica para garantizar una integración perfecta con tu vehículo.`}
              </p>
            )}

            {pestana === 'caracteristicas' && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                {ficha.caracteristicas.map((c, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                    <span className="mt-1 text-blue-500 font-black">✓</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            )}

            {pestana === 'especificaciones' && (
              <div className="max-w-3xl">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-white/[0.05]">
                    {ficha.especificaciones.map((spec, i) => (
                      <tr key={i}>
                        <td className="py-4 pr-6 text-xs font-mono uppercase tracking-wider text-gray-500 w-1/2">
                          {spec.etiqueta}
                        </td>
                        <td className="py-4 text-sm font-bold text-gray-200">{spec.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
