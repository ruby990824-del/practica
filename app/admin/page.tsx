'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [autenticado, setAutenticado] = useState(false);
  const [inventario, setInventario] = useState<any[]>([]);
  const [fotoBase64, setFotoBase64] = useState('');
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    categoria: 'Baterías'
  });

  // Verificar la sesión del Administrador al entrar
  useEffect(() => {
    const sesion = localStorage.getItem('usuario_sesion_activa');
    if (!sesion) {
      router.push('/auth');
      return;
    }
    
    const usuario = JSON.parse(sesion);
    if (usuario.rol !== 'admin') {
      router.push('/tienda'); // Si es cliente común, lo mandamos a la tienda
    } else {
      setAutenticado(true);
    }

    // Cargar inventario global
    const guardado = localStorage.getItem('catalogo_motoparts_global');
    if (guardado) {
      setInventario(JSON.parse(guardado));
    }
  }, [router]);

  // Manejar conversión de la foto a Base64
  const manejarFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = e.target.files;
    if (archivos && archivos[0]) {
      const lector = new FileReader();
      lector.onloadend = () => {
        setFotoBase64(lector.result as string);
      };
      lector.readAsDataURL(archivos[0]);
    }
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | React.SelectElement>) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarComponente = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    const piezaNueva = {
      id: 'PROD-' + Math.floor(1000 + Math.random() * 9000),
      nombre: nuevoProducto.nombre,
      precio: Number(nuevoProducto.precio),
      categoria: nuevoProducto.categoria,
      imagen: fotoBase64 || null // Guarda la cadena de la foto
    };

    const nuevoInventario = [...inventario, piezaNueva];
    setInventario(nuevoInventario);
    localStorage.setItem('catalogo_motoparts_global', JSON.stringify(nuevoInventario));

    // Resetear
    setNuevoProducto({ nombre: '', precio: '', categoria: 'Baterías' });
    setFotoBase64('');
    const inputFoto = document.getElementById('input-foto') as HTMLInputElement;
    if (inputFoto) inputFoto.value = '';
  };

  const eliminarComponente = (id: string) => {
    const nuevoInventario = inventario.filter(item => item.id !== id);
    setInventario(nuevoInventario);
    localStorage.setItem('catalogo_motoparts_global', JSON.stringify(nuevoInventario));
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario_sesion_activa');
    router.push('/auth');
  };

  if (!autenticado) {
    return (
      <div className="w-full min-h-screen bg-[#0a0c14] flex items-center justify-center text-gray-500 font-mono text-xs uppercase tracking-widest">
        Verificando Credenciales de Administrador...
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] pt-28 pb-20 text-white font-sans">
      <div className="max-w-[1100px] mx-auto px-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-2">Panel Admin RAVA</h1>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Control Seguro de Repuestos y Multimedia</p>
          </div>
          <div className="flex gap-3">
            <Link href="/tienda" className="bg-[#161925] hover:bg-[#1c2030] text-gray-400 border border-white/5 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all">
              Ver Tienda
            </Link>
            <button onClick={cerrarSesion} className="bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all">
              Salir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* FORMULARIO EDITADO CON FOTO */}
          <form onSubmit={agregarComponente} className="lg:col-span-4 bg-[#11131e] border border-white/5 rounded-[2.5rem] p-8 space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-500 mb-2">Añadir Nueva Pieza</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-500">Nombre del Repuesto</label>
              <input 
                type="text" name="nombre" value={nuevoProducto.nombre} onChange={manejarCambio} required
                className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="Ej. Batería RAVA Inteligente"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-500">Precio (USD)</label>
              <input 
                type="number" name="precio" value={nuevoProducto.precio} onChange={manejarCambio} required
                className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-blue-500 text-white"
                placeholder="450"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-500">Categoría</label>
              <select 
                name="categoria" value={nuevoProducto.categoria} onChange={manejarCambio}
                className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white cursor-pointer"
              >
                <option value="Baterías">Baterías</option>
                <option value="Motores">Motores</option>
                <option value="Controladores">Controladores</option>
                <option value="Chasis y Estructura">Chasis y Estructura</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-gray-500">Foto del Componente</label>
              <input 
                id="input-foto" type="file" accept="image/*" onChange={manejarFoto}
                className="w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-mono file:bg-blue-600/10 file:text-blue-400 hover:file:bg-blue-600/20 cursor-pointer"
              />
              {fotoBase64 && (
                <div className="mt-2 w-20 h-20 rounded-xl overflow-hidden border border-white/10">
                  <img src={fotoBase64} alt="Previsualización" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_15px_30px_-10px_rgba(37,99,235,0.3)] transition-all"
            >
              Ingresar al Catálogo
            </button>
          </form>

          {/* TABLA DE INVENTARIO */}
          <div className="lg:col-span-8 bg-[#11131e]/50 border border-white/5 rounded-[2.5rem] p-8">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6">Componentes en Almacén ({inventario.length})</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] font-mono uppercase text-gray-500 tracking-wider">
                    <th className="pb-4 font-normal">Miniatura</th>
                    <th className="pb-4 font-normal">Repuesto</th>
                    <th className="pb-4 font-normal">Categoría</th>
                    <th className="pb-4 font-normal">Precio</th>
                    <th className="pb-4 font-normal text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-sm">
                  {inventario.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-4">
                        <div className="w-10 h-10 bg-[#161925] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
                          {item.imagen ? (
                            <img src={item.imagen} alt="Pieza" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-mono text-gray-600">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 font-bold uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{item.nombre}</td>
                      <td className="py-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/10 rounded-md">
                          {item.categoria}
                        </span>
                      </td>
                      <td className="py-4 font-mono font-bold text-gray-300">${item.precio}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => eliminarComponente(item.id)}
                          className="text-xs text-red-500/70 hover:text-red-400 font-mono uppercase tracking-wider transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}