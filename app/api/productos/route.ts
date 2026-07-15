import { NextResponse } from 'next/server';

// Estos son tus datos que mañana podrían venir de una base de datos real
const PRODUCTOS = [
  { id: 1, nombre: 'Batería de Litio 72V', precio: 450, imagen: '🔋' },
  { id: 2, nombre: 'Motor RAVA 1000W', precio: 300, imagen: '⚙️' },
  { id: 3, nombre: 'Controlador Programable', precio: 120, imagen: '📱' },
  { id: 4, nombre: 'Cargador Rápido', precio: 80, imagen: '⚡' },
];

export async function GET() {
  // Simulamos una respuesta de servidor exitosa (200 OK)
  return NextResponse.json(PRODUCTOS);
}