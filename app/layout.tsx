'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Ajustamos la interfaz para que coincida exactamente con tu AuthPage
interface Usuario {
  nombre: string;
  rol: 'admin' | 'cliente'; // Cambiado de 'role' a 'rol' para que use tu lógica
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Función aislada para leer la sesión real de tu AuthPage
  const cargarSesionDeUsuario = () => {
    // Usamos la llave exacta que definiste en tu AuthPage 👈
    const sesionActiva = localStorage.getItem('usuario_sesion_activa');
    if (sesionActiva) {
      try {
        setUsuario(JSON.parse(sesionActiva));
      } catch (error) {
        console.error("Error al parsear usuario_sesion_activa:", error);
      }
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    // 1. Sincronización del Tema
    const modoGuardado = localStorage.getItem('fkr_theme');
    if (modoGuardado === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // 2. Carga inicial de la sesión
    cargarSesionDeUsuario();
    setMounted(true);

    // 3. Escuchar el evento personalizado que lanza tu AuthPage 👈
    window.addEventListener('sesion-cambiada', cargarSesionDeUsuario);

    // Limpieza del listener al desmontar
    return () => {
      window.removeEventListener('sesion-cambiada', cargarSesionDeUsuario);
    };
  }, []);

  const toggleTheme = () => {
    const nuevoModo = !isDarkMode;
    setIsDarkMode(nuevoModo);
    if (nuevoModo) {
      localStorage.setItem('fkr_theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('fkr_theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  const cerrarSesion = () => {
    // Limpiamos usando tu llave exacta 👈
    localStorage.removeItem('usuario_sesion_activa');
    setUsuario(null);
  };

  return (
    <html lang="es" className={isDarkMode ? 'dark' : ''}>
      <body className={`antialiased transition-colors duration-500 min-h-screen flex flex-col ${
        isDarkMode ? 'bg-[#07090e] text-white' : 'bg-[#f4f6fa] text-gray-900'
      }`}>
        
        {/* ENCABEZADO ESTRUCTURADO EN TRES COLUMNAS */}
        <header className={`w-full border-b py-5 px-6 md:px-12 relative z-50 transition-colors duration-500 ${
          isDarkMode ? 'bg-[#07090e] border-white/5' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-4">
            
            {/* COLUMNA 1: LOGOTIPO FKR EN ROJO */}
            <div className="flex justify-center md:justify-start items-center">
              <Link href="/" className="flex items-center gap-2.5 group cursor-pointer select-none shrink-0 font-sans">
                <span className="text-2xl font-black uppercase tracking-tighter text-[#990000]">
                  FKR
                </span>
                <span className={`text-[9px] font-mono font-bold uppercase tracking-[0.3em] px-2 py-0.5 rounded-md transition-colors duration-500 ${
                  isDarkMode 
                    ? 'bg-white/5 text-gray-300 border border-white/10' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  LAB
                </span>
              </Link>
            </div>

            {/* COLUMNA 2: NAVEGACIÓN CENTRAL */}
            <nav className={`flex items-center justify-center gap-8 font-sans text-[11px] font-black uppercase tracking-widest transition-colors duration-500 shrink-0 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <Link href="/" className="hover:text-[#990000] transition-colors duration-300">
                Inicio
              </Link>
              <Link href="/tienda" className="hover:text-[#990000] transition-colors duration-300">
                Tienda
              </Link>
              <Link href="/soporte" className="hover:text-[#990000] transition-colors duration-300">
                Soporte
              </Link>
              
              {/* PANEL DE ADMIN: Corregido para validar usando .rol === 'admin' 👈 */}
              {mounted && usuario?.rol === 'admin' && (
                <Link 
                  href="/admin" 
                  className="text-[#990000] dark:text-red-500 hover:underline transition-colors duration-300 font-extrabold shadow-sm"
                >
                  ⚡ Admin Panel
                </Link>
              )}
            </nav>

            {/* COLUMNA 3: ACCIONES DE USUARIO DINÁMICAS */}
            <div className="flex justify-center md:justify-end items-center gap-4">
              {/* Interruptor de Tema */}
              <button
                type="button"
                onClick={toggleTheme}
                className={`px-4 py-2.5 rounded-full font-bold uppercase text-[9px] tracking-wider border shadow-sm transition-all duration-300 cursor-pointer shrink-0 ${
                  isDarkMode 
                    ? 'bg-[#131622] text-white border-white/10 hover:bg-white hover:text-black' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-black hover:text-white'
                }`}
              >
                {isDarkMode ? '☀️ Claro' : '🌙 Oscuro'}
              </button>

              {/* Renderizado condicional reactivo al evento de AuthPage */}
              {mounted && (
                usuario ? (
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-bold tracking-wide text-gray-400 dark:text-gray-300">
                      Bienvenido, <span className="text-gray-900 dark:text-white font-black">{usuario.nombre}</span>
                    </span>
                    
                    <button 
                      onClick={cerrarSesion}
                      className="text-[10px] uppercase tracking-wider font-extrabold text-gray-400 hover:text-[#990000] transition-colors duration-300 cursor-pointer"
                    >
                      [Salir]
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth" 
                    className="px-5 py-2.5 bg-[#990000] text-white hover:bg-black rounded-full font-bold uppercase text-[9px] tracking-wider shadow-sm transition-all duration-300 shrink-0 text-center"
                  >
                    Ingresar
                  </Link>
                )
              )}
            </div>

          </div>
        </header>

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}