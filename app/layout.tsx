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
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-base text-ink">

        {/* ===== HEADER estilo SaaS ===== */}
        <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-base/70 border-b border-line">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 py-4 px-6 md:px-10">

            {/* LOGO — glyph morado + wordmark */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0 select-none">
              <span className="grid place-items-center w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-deep text-white font-black text-sm shadow-lg shadow-brand/30">
                F
              </span>
              <span className="flex items-baseline gap-1.5">
                <span className="text-lg font-extrabold tracking-tight text-ink">FKR</span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-muted">Lab</span>
              </span>
            </Link>

            {/* NAV central */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
              <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
              <Link href="/tienda" className="hover:text-ink transition-colors">Tienda</Link>
              <Link href="/soporte" className="hover:text-ink transition-colors">Soporte</Link>
              {mounted && usuario?.rol === 'admin' && (
                <Link href="/admin" className="text-brand-soft hover:text-brand transition-colors font-semibold">
                  Admin
                </Link>
              )}
            </nav>

            {/* ACCIONES */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Cambiar tema"
                className="grid place-items-center w-9 h-9 rounded-full border border-line text-muted hover:text-ink hover:bg-white/5 transition-colors cursor-pointer"
              >
                {isDarkMode ? '☀' : '☾'}
              </button>

              {mounted && (
                usuario ? (
                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-sm text-muted">
                      Hola, <span className="text-ink font-semibold">{usuario.nombre}</span>
                    </span>
                    <button
                      onClick={cerrarSesion}
                      className="text-xs font-semibold text-muted hover:text-brand-soft transition-colors cursor-pointer"
                    >
                      Salir
                    </button>
                  </div>
                ) : (
                  <Link href="/auth" className="btn-outline-brand text-sm">
                    Ingresar
                  </Link>
                )
              )}
            </div>

          </div>
        </header>

        {/* CONTENIDO */}
        <main className="flex-1">
          {children}
        </main>

      </body>
    </html>
  );
}