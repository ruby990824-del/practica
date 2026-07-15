'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import Visor3d from '../src/componentes/Visor3d';
import { obtenerFicha } from '../src/componentes/especificaciones';

export default function TiendaPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<any[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('todos');

  const [productoSeleccionado, setProductoSeleccionado] = useState<any | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [vistaModal, setVistaModal] = useState<'3d' | 'foto'>('3d');

  const categorias = [
    { id: 'todos', nombre: 'Ver Todo' },
    { id: 'Baterías', nombre: 'Baterías' },
    { id: 'Motores', nombre: 'Motores' },
    { id: 'Controladores', nombre: 'Controladores' },
    { id: 'Chasis y Estructura', nombre: 'Chasis y Estructura' }
  ];

  useEffect(() => {
    function cargarCatalogo() {
      try {
        const guardado = localStorage.getItem('catalogo_motoparts_global');
        if (guardado) {
          const datos = JSON.parse(guardado);
          setProductos(datos);
          setProductosFiltrados(datos);
        } else {
          const iniciales = [
            { id: '1', nombre: 'Controlador Programable RAVA', precio: 120, categoria: 'Controladores', imagen: null, descripcion: 'Controlador de alta eficiencia optimizado para motores RAVA. Soporta configuraciones de voltaje avanzadas y gestión térmica mejorada.' },
            { id: '2', nombre: 'Batería Litio 72V 40Ah', precio: 650, categoria: 'Baterías', imagen: null, descripcion: 'Celdas de alta densidad energética con BMS inteligente integrado. Ideal para maximizar la autonomía de tu motocicleta eléctrica.' },
            { id: '3', nombre: 'Motor Hub 3000W Alto Torque', precio: 380, categoria: 'Motores', imagen: null, descripcion: 'Motor de cubo trasero sin escobillas (Brushless). Entrega torque inmediato con excelente disipación de calor para pendientes pronunciadas.' },
            { id: '4', nombre: 'Amortiguador Trasero Reforzado', precio: 85, categoria: 'Chasis y Estructura', imagen: null, descripcion: 'Suspensión trasera regulable con amortiguación hidráulica reforzada. Absorbe impactos de forma suave garantizando estabilidad estructural.' }
          ];
          setProductos(iniciales);
          setProductosFiltrados(iniciales);
          localStorage.setItem('catalogo_motoparts_global', JSON.stringify(iniciales));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    }
    cargarCatalogo();
  }, []);

  useEffect(() => {
    let resultado = productos;
    if (busqueda.trim() !== '') {
      resultado = resultado.filter((p) => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    }
    if (categoriaActiva !== 'todos') {
      resultado = resultado.filter((p) => p.categoria && p.categoria.toLowerCase() === categoriaActiva.toLowerCase());
    }
    setProductosFiltrados(resultado);
  }, [busqueda, categoriaActiva, productos]);

  const procesarPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoSeleccionado) return;

    const intencionCompra = {
      productoId: productoSeleccionado.id,
      nombre: productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      cantidad: cantidad,
      total: productoSeleccionado.precio * cantidad,
      metodoPreferencia: 'Visa Débito'
    };
    
    localStorage.setItem('fkr_checkout_item', JSON.stringify(intencionCompra));
    setProductoSeleccionado(null);
    router.push('/checkout'); 
  };

  if (cargando) {
    return (
      <div className="w-full min-h-screen bg-[#0a0c14] flex items-center justify-center text-gray-500 font-mono text-xs uppercase tracking-widest">
        Sincronizando Almacén...
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] pt-20 pb-20 text-white font-sans relative">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Encabezado e hito de la tienda */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Catálogo de Repuestos</h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Componentes originales para tu ecosistema eléctrico</p>
          </div>
          <Link href="/" className="text-xs font-mono text-gray-400 hover:text-white uppercase tracking-wider underline">
            ← Volver al Inicio
          </Link>
        </div>

        {/* Buscador y Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-12 bg-[#11131e] border border-white/5 rounded-[2.5rem] p-6">
          <div className="md:col-span-4">
            <input 
              type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full bg-[#161925] border border-white/5 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
            />
          </div>
          <div className="md:col-span-8 flex flex-wrap gap-2 justify-start md:justify-end">
            {categorias.map((cat) => (
              <button
                key={cat.id} onClick={() => setCategoriaActiva(cat.id)}
                className={`text-[11px] font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all ${
                  categoriaActiva === cat.id ? 'bg-blue-600 text-white' : 'bg-[#161925] text-gray-400'
                }`}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        </div>

        {/* Grilla de Repuestos */}
        {productosFiltrados.length === 0 ? (
          <div className="text-center py-20 border border-white/5 border-dashed rounded-[2.5rem]">
            <p className="text-gray-500 font-mono text-xs uppercase">No hay componentes en esta sección</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {productosFiltrados.map((producto) => (
              <div 
                key={producto.id} 
                onClick={() => { setProductoSeleccionado(producto); setCantidad(1); setVistaModal('3d'); }}
                className="bg-[#11131e] border border-white/5 rounded-[2.5rem] p-6 flex flex-col justify-between group cursor-pointer hover:border-blue-500/30 hover:bg-[#131624] transition-all duration-300"
              >
                <div>
                  <div className="w-full h-48 bg-[#161925] border border-white/5 rounded-2xl overflow-hidden mb-5 flex items-center justify-center">
                    {producto.imagen ? (
                      <img src={producto.imagen} alt={producto.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Sin foto</span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 block mb-1">{producto.categoria}</span>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4 group-hover:text-blue-400 transition-colors">{producto.nombre}</h3>
                </div>
                <div className="border-t border-white/5 pt-4 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-gray-500 block">Precio</span>
                    <span className="text-xl font-mono font-black">${producto.precio}</span>
                  </div>
                  <span className="text-[10px] bg-[#161925] border border-white/5 text-gray-400 px-4 py-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    Ver Detalle
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL DE DETALLE Y PAGO DE PRODUCTO */}
      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[550px] bg-[#11131e] border border-white/10 rounded-[2.5rem] p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Botón Cerrar */}
            <button 
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-white font-mono text-lg"
            >
              ✕
            </button>

            {/* Cabecera del Modal */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">{productoSeleccionado.categoria}</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-white mt-1">{productoSeleccionado.nombre}</h2>
            </div>

            {/* Contenido / Visor 3D + Descripción */}
            <div className="space-y-4">
              <div className="w-full h-56 bg-[#161925] border border-white/5 rounded-2xl overflow-hidden relative">
                {vistaModal === '3d' && (
                  <span className="absolute top-3 left-3 z-20 text-[9px] font-mono uppercase tracking-widest text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                    ◎ 360° · arrastra
                  </span>
                )}
                {vistaModal === '3d' ? (
                  <Visor3d categoria={productoSeleccionado.categoria} />
                ) : productoSeleccionado.imagen ? (
                  <img src={productoSeleccionado.imagen} alt={productoSeleccionado.nombre} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    Sin foto de referencia
                  </div>
                )}
              </div>

              {/* Conmutador 3D / Foto */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setVistaModal('3d')}
                  className={`flex-1 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border transition-all ${
                    vistaModal === '3d' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#161925] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Visor 3D
                </button>
                <button
                  type="button"
                  onClick={() => setVistaModal('foto')}
                  className={`flex-1 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-xl border transition-all ${
                    vistaModal === 'foto' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#161925] border-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  Foto Real
                </button>
              </div>

              <p className="text-sm text-gray-400 leading-relaxed">
                {productoSeleccionado.descripcion || 'Especificaciones de fábrica originales garantizadas para optimizar el rendimiento técnico de tu configuración.'}
              </p>

              {/* Vista previa de información adicional (ficha técnica) */}
              <div className="bg-[#161925] border border-white/5 rounded-xl p-4">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gray-500 block mb-3">Información técnica</span>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {obtenerFicha(productoSeleccionado).especificaciones.slice(0, 4).map((spec, i) => (
                    <div key={i} className="flex justify-between gap-2 border-b border-white/[0.04] pb-1">
                      <span className="text-[10px] text-gray-500 truncate">{spec.etiqueta}</span>
                      <span className="text-[10px] font-bold text-gray-300 text-right">{spec.valor}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/producto/${productoSeleccionado.id}`}
                  className="inline-block mt-3 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300"
                >
                  Ver ficha completa 3D →
                </Link>
              </div>
            </div>

            {/* Formulario de compra y cálculo de precio */}
            <form onSubmit={procesarPago} className="border-t border-white/5 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-gray-500 block">Precio Unitario</span>
                  <span className="text-xl font-mono font-black text-white">${productoSeleccionado.precio}</span>
                </div>
                
                {/* Selector de Cantidad */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-gray-500 mr-2">Cantidad</span>
                  <button 
                    type="button"
                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                    className="w-8 h-8 bg-[#161925] border border-white/5 rounded-lg font-bold flex items-center justify-center hover:bg-white/10"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-bold text-sm">{cantidad}</span>
                  <button 
                    type="button"
                    onClick={() => setCantidad(cantidad + 1)}
                    className="w-8 h-8 bg-[#161925] border border-white/5 rounded-lg font-bold flex items-center justify-center hover:bg-white/10"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Resumen Total */}
              <div className="bg-[#161925] border border-white/5 rounded-xl p-4 flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-mono text-gray-400 block uppercase">Total a pagar</span>
                  <span className="text-2xl font-mono font-black text-blue-500">${productoSeleccionado.precio * cantidad}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-mono text-gray-500 block uppercase">Método</span>
                  <span className="text-[11px] font-black tracking-wider text-gray-300">💳 VISA DEBITO</span>
                </div>
              </div>

              {/* Botón de Compra */}
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_15px_30px_-10px_rgba(37,99,235,0.3)] transition-all"
              >
                Proceder al Pago Seguro
              </button>
            </form>

          </div>
        </div>
      )}
    </main>
  );
}