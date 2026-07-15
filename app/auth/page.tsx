'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [esLogin, setEsLogin] = useState(true);
  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    rol: 'cliente' // cliente o admin
  });
  const [error, setError] = useState('');

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | React.SelectElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const ejecutarAccion = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usuariosGuardados = localStorage.getItem('usuarios_motoparts');
    let listaUsuarios = usuariosGuardados ? JSON.parse(usuariosGuardados) : [];

    if (esLogin) {
      // LOGIC: Iniciar Sesión
      const usuarioEncontrado = listaUsuarios.find(
        (u: any) => u.correo === formulario.correo && u.contrasena === formulario.contrasena
      );

      if (usuarioEncontrado) {
        localStorage.setItem('usuario_sesion_activa', JSON.stringify(usuarioEncontrado));
        window.dispatchEvent(new Event('sesion-cambiada'));
        
        // Redirección condicional según el rol
        if (usuarioEncontrado.rol === 'admin') {
          router.push('/admin');
        } else {
          router.push('/tienda');
        }
      } else {
        setError('Credenciales incorrectas o el usuario no existe.');
      }
    } else {
      // LOGIC: Crear Cuenta
      const existe = listaUsuarios.some((u: any) => u.correo === formulario.correo);
      if (existe) {
        setError('Este correo ya está registrado.');
        return;
      }

      const nuevoUsuario = {
        id: 'USER-' + Math.floor(1000 + Math.random() * 9000),
        nombre: formulario.nombre,
        correo: formulario.correo,
        contrasena: formulario.contrasena,
        rol: formulario.rol
      };

      listaUsuarios.push(nuevoUsuario);
      localStorage.setItem('usuarios_motoparts', JSON.stringify(listaUsuarios));
      
      // Iniciar sesión automático tras registrarse
      localStorage.setItem('usuario_sesion_activa', JSON.stringify(nuevoUsuario));
      window.dispatchEvent(new Event('sesion-cambiada'));

      if (nuevoUsuario.rol === 'admin') {
        router.push('/admin');
      } else {
        router.push('/tienda');
      }
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#0a0c14] flex items-center justify-center pt-20 pb-10 text-white font-sans">
      <div className="w-full max-w-[450px] bg-[#11131e] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white">
            {esLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">
            {esLogin ? 'Accede a tu cuenta RAVA' : 'Únete al ecosistema de repuestos'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs font-mono text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={ejecutarAccion} className="space-y-4">
          {!esLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Nombre</label>
              <input 
                type="text" name="nombre" value={formulario.nombre} onChange={manejarCambio} required
                className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                placeholder="Tu nombre"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-gray-500">Correo Electrónico</label>
            <input 
              type="email" name="correo" value={formulario.correo} onChange={manejarCambio} required
              className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-mono uppercase text-gray-500">Contraseña</label>
            <input 
              type="password" name="contrasena" value={formulario.contrasena} onChange={manejarCambio} required
              className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white"
              placeholder="••••••••"
            />
          </div>

          {!esLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-gray-500">Tipo de Perfil</label>
              <select 
                name="rol" value={formulario.rol} onChange={manejarCambio}
                className="w-full bg-[#161925] border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 text-white appearance-none cursor-pointer"
              >
                <option value="cliente">Cliente (Comprador)</option>
                <option value="admin">Administrador (Gestión de Tienda)</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl shadow-[0_15px_30px_-10px_rgba(37,99,235,0.3)] transition-all mt-4"
          >
            {esLogin ? 'Ingresar Neto' : 'Confirmar Registro'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button 
            onClick={() => { setEsLogin(!esLogin); setError(''); }}
            className="text-xs text-gray-400 hover:text-blue-400 font-medium transition-colors underline underline-offset-4"
          >
            {esLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia Sesión'}
          </button>
        </div>

      </div>
    </main>
  );
}