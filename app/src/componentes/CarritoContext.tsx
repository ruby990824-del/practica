'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// Definimos qué estructura tiene un producto en el carrito
interface CartItem {
  id: string | number;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CarritoContextType {
  carrito: CartItem[];
  agregarAlCarrito: (producto: any) => void;
  eliminarDelCarrito: (id: string | number) => void;
  limpiarCarrito: () => void;
  totalItems: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<CartItem[]>([]);

  // Cargar el carrito del localStorage al iniciar (para que no se borre al recargar)
  useEffect(() => {
    const carritoGuardado = localStorage.getItem('rava_cart');
    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('rava_cart', JSON.stringify(carrito));
    } else {
      localStorage.removeItem('rava_cart');
    }
  }, [carrito]);

  const agregarAlCarrito = (producto: any) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => String(item.id) === String(producto.id));
      if (existe) {
        // Si ya está, le sumamos 1 a la cantidad
        return prev.map((item) =>
          String(item.id) === String(producto.id)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      // Si es nuevo, lo agregamos con cantidad 1
      return [...prev, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  };

  const eliminarDelCarrito = (id: string | number) => {
    setCarrito((prev) => prev.filter((item) => String(item.id) !== String(id)));
  };

  const limpiarCarrito = () => setCarrito([]);

  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, limpiarCarrito, totalItems }}>
      {children}
    </CarritoContext.Provider>
  );
}

// Hook personalizado para usar el carrito fácil en cualquier componente
export function useCarrito() {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
}