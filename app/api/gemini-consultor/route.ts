import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { cargas, totalWatts, equipos } = await req.json();
    
    // API key for OpenRouter (definida en variables de entorno, nunca en el código)
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("API key not configured");
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Construir descripción de cargas seleccionadas
    const cargasSeleccionadas = equipos
      .filter((eq: any) => cargas[eq.id] > 0)
      .map((eq: any) => `${cargas[eq.id]}x ${eq.nombre} (${eq.watts}W)`)
      .join(", ");

    // Calcular recomendaciones base
    const kw = Math.ceil(totalWatts / 1000);
    const panelWatts = 450; // Watts por panel típico
    const paneles = Math.ceil((totalWatts * 1.3) / panelWatts); // 30% de sobrecapacidad
    const bateriasKwh = Math.ceil(kw * 5); // Aproximadamente 5 horas de autonomía
    const areaTecho = Math.round(paneles * 2.2);
    const pesoTotal = paneles * 21;
    const inversorRecomendado = Math.ceil(kw * 1.25);

    const prompt = `SISTEMA DE ENERGÍA SOLAR - ANÁLISIS TÉCNICO DETALLADO

CARGAS DEL CLIENTE:
${cargasSeleccionadas}
CARGA TOTAL: ${totalWatts}W (${kw}kW)

DATOS CALCULADOS PARA ESTE SISTEMA:
- Inversor recomendado: ${inversorRecomendado}kW
- Cantidad de paneles: ${paneles} paneles de 450W
- Área de techo requerida: ${areaTecho} m²
- Peso total: ${pesoTotal} kg
- Autonomía: ${bateriasKwh} días

INSTRUCCIONES CRÍTICAS:
1. NO copies los valores de ejemplo
2. Genera un CONSEJO TÉCNICO ESPECÍFICO para esta carga (${totalWatts}W)
3. Genera una NOTA ADICIONAL específica para el cliente
4. Sé específico y relevante a los equipos seleccionados

EJEMPLO DE LO QUE NO DEBES HACER:
❌ "Consejo técnico específico" 
❌ "Información importante"

EJEMPLOS DE LO QUE SÍ DEBES HACER:
✅ Para sistemas con AC/Split: "Instala el inversor cerca de los equipos de refrigeración para minimizar caídas de tensión"
✅ Para sistemas con bombas: "Utiliza cables de cobre de buena calidad para evitar sobrecalentamiento"

RESPONDE EXACTAMENTE EN JSON:
{
  "kw": "${kw}kW",
  "paneles": "${paneles} paneles de 450W",
  "inversor": "${inversorRecomendado}kW",
  "cable": "Selecciona: 6, 10, 16 o 25mm2",
  "areaTecho": "${areaTecho} m²",
  "peso": "${pesoTotal} kg",
  "autonomia": "${bateriasKwh} días",
  "consejo": "TU CONSEJO ÚNICO Y ESPECÍFICO AQUÍ - NO GENÉRICO",
  "notaAdicional": "INFORMACIÓN ÚNICA Y RELEVANTE PARA ESTE CLIENTE"
}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://localhost:3000",
        "X-Title": "Rosen Energy Calculator"
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo",
        "messages": [
          { 
            "role": "user", 
            "content": prompt
          }
        ],
        "temperature": 0.7,
        "max_tokens": 500
      }),
    });

    const data = await response.json();
    
    // Verificamos si OpenRouter nos dio un error directo
    if (data.error) {
      console.error("Error desde OpenRouter:", data.error);
      return NextResponse.json({ error: data.error.message || "Error en OpenRouter" }, { status: 500 });
    }

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("Respuesta inválida de OpenRouter:", data);
      return NextResponse.json({ error: "Respuesta inválida de la IA" }, { status: 500 });
    }

    const content = data.choices[0].message.content.trim();
    
    console.log("Respuesta bruta de la IA:", content);
    
    // Extracción del JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("No se encontró JSON en la respuesta:", content);
      return NextResponse.json({ error: "La IA no devolvió un formato válido" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    console.log("JSON parseado:", result);

    // Calcular campos que falten automáticamente
    const panelesCantidad = parseInt(result.paneles) || paneles;
    const areaTechoCalculada = Math.round(panelesCantidad * 2.2);
    const pesoCalculado = panelesCantidad * 21;
    const autonomiaCalculada = bateriasKwh;

    // Completar información faltante
    const resultadoCompleto = {
      kw: result.kw || `${kw}kW`,
      paneles: result.paneles || `${paneles} paneles de 450W`,
      inversor: result.inversor || `${kw * 1.3}kW`,
      cable: result.cable || "10mm2",
      areaTecho: result.areaTecho || `${areaTechoCalculada} m²`,
      peso: result.peso || `${pesoCalculado} kg`,
      autonomia: result.autonomia || `${autonomiaCalculada} días`,
      consejo: result.consejo || "Mantén los paneles limpios para óptimo rendimiento",
      notaAdicional: result.notaAdicional || "Se recomienda instalar el sistema en orientación norte para máxima eficiencia"
    };

    console.log("Resultado final con campos completos:", resultadoCompleto);
    return NextResponse.json(resultadoCompleto);
    
  } catch (error: any) {
    console.error("ERROR EN LA API:", error);
    return NextResponse.json({ error: error.message || "Error procesando la solicitud" }, { status: 500 });
  }
}