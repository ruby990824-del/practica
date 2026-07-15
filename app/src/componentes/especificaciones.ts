// Generador de "información adicional" estilo PC Componentes.
// A partir de un producto (que en el admin solo tiene nombre/precio/categoría),
// devuelve una ficha técnica coherente según su categoría. Si el producto ya
// trae `caracteristicas` o `especificaciones` propias, esas tienen prioridad.

export interface Especificacion {
  etiqueta: string;
  valor: string;
}

export interface FichaTecnica {
  caracteristicas: string[];
  especificaciones: Especificacion[];
}

interface ProductoLike {
  id?: string | number;
  nombre?: string;
  categoria?: string;
  caracteristicas?: string[];
  especificaciones?: Especificacion[];
}

const PLANTILLAS: Record<string, FichaTecnica> = {
  bateria: {
    caracteristicas: [
      'BMS inteligente integrado para proteger cada celda',
      'Celdas de alta densidad energética Li-ion NMC',
      'Carga rápida compatible con cargadores RAVA',
      'Protección contra cortocircuito y sobrecarga',
    ],
    especificaciones: [
      { etiqueta: 'Voltaje nominal', valor: '72 V' },
      { etiqueta: 'Capacidad', valor: '40 Ah' },
      { etiqueta: 'Química', valor: 'Li-ion NMC' },
      { etiqueta: 'Ciclos de vida', valor: '1500+ cargas' },
      { etiqueta: 'Tiempo de carga', valor: '4 - 6 h' },
      { etiqueta: 'Temperatura de operación', valor: '-10 °C a 45 °C' },
      { etiqueta: 'Peso', valor: '12 kg' },
    ],
  },
  motor: {
    caracteristicas: [
      'Motor Brushless sin escobillas de alto torque',
      'Entrega de potencia inmediata en pendientes',
      'Excelente disipación de calor por aire',
      'Funcionamiento silencioso y de baja vibración',
    ],
    especificaciones: [
      { etiqueta: 'Potencia', valor: '3000 W' },
      { etiqueta: 'Voltaje nominal', valor: '72 V' },
      { etiqueta: 'Torque', valor: '120 Nm' },
      { etiqueta: 'Tipo', valor: 'Hub trasero' },
      { etiqueta: 'Velocidad máxima', valor: '90 km/h' },
      { etiqueta: 'Refrigeración', valor: 'Por aire' },
      { etiqueta: 'Peso', valor: '8 kg' },
    ],
  },
  controlador: {
    caracteristicas: [
      'Totalmente programable vía aplicación',
      'Gestión térmica avanzada',
      'Protección múltiple (sobrecorriente, temperatura)',
      'Amplia compatibilidad con motores RAVA',
    ],
    especificaciones: [
      { etiqueta: 'Corriente máxima', valor: '60 A' },
      { etiqueta: 'Rango de voltaje', valor: '48 - 72 V' },
      { etiqueta: 'MOSFETs', valor: '18 unidades' },
      { etiqueta: 'Modos de conducción', valor: '3 (Eco / Sport / Turbo)' },
      { etiqueta: 'Conectividad', valor: 'Bluetooth (App)' },
      { etiqueta: 'Protección', valor: 'IP65' },
      { etiqueta: 'Peso', valor: '1.2 kg' },
    ],
  },
  chasis: {
    caracteristicas: [
      'Aleación de aluminio aeronáutico',
      'Tratamiento anticorrosión anodizado',
      'Estructura reforzada de alta rigidez',
      'Diseño ligero sin sacrificar resistencia',
    ],
    especificaciones: [
      { etiqueta: 'Material', valor: 'Aleación Al 6061' },
      { etiqueta: 'Acabado', valor: 'Anodizado' },
      { etiqueta: 'Carga máxima', valor: '180 kg' },
      { etiqueta: 'Amortiguación', valor: 'Hidráulica regulable' },
      { etiqueta: 'Compatibilidad', valor: 'Universal RAVA' },
      { etiqueta: 'Peso', valor: '3.5 kg' },
    ],
  },
};

const POR_DEFECTO: FichaTecnica = {
  caracteristicas: [
    'Componente original garantizado por RAVA',
    'Especificaciones de fábrica para máximo rendimiento',
    'Instalación compatible con el ecosistema RAVA',
  ],
  especificaciones: [
    { etiqueta: 'Estado', valor: 'Nuevo / Original' },
    { etiqueta: 'Compatibilidad', valor: 'Ecosistema RAVA' },
  ],
};

function plantillaPorCategoria(categoria?: string): FichaTecnica {
  const cat = (categoria || '').toLowerCase();
  if (cat.includes('bater')) return PLANTILLAS.bateria;
  if (cat.includes('motor')) return PLANTILLAS.motor;
  if (cat.includes('control')) return PLANTILLAS.controlador;
  if (cat.includes('chas') || cat.includes('estruct') || cat.includes('amortig'))
    return PLANTILLAS.chasis;
  return POR_DEFECTO;
}

export function obtenerFicha(producto: ProductoLike): FichaTecnica {
  const base = plantillaPorCategoria(producto.categoria);

  const caracteristicas =
    producto.caracteristicas && producto.caracteristicas.length > 0
      ? producto.caracteristicas
      : base.caracteristicas;

  // Especificaciones base + universales (marca, SKU, garantía)
  const universales: Especificacion[] = [
    { etiqueta: 'Marca', valor: 'RAVA' },
    { etiqueta: 'SKU', valor: String(producto.id ?? '—') },
    { etiqueta: 'Garantía', valor: '12 meses' },
  ];

  const especificaciones =
    producto.especificaciones && producto.especificaciones.length > 0
      ? [...producto.especificaciones, ...universales]
      : [...base.especificaciones, ...universales];

  return { caracteristicas, especificaciones };
}
