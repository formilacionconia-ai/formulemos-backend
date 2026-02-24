import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

console.log("OPENROUTER_API_KEY cargada:", !!process.env.OPENROUTER_API_KEY);
console.log("Backend activo en puerto", PORT);

app.post("/api/chat", async (req, res) => {
  try {
    // Acepta message o prompt (compatibilidad total)
    const userInput = req.body.message || req.body.prompt;

    if (!userInput || typeof userInput !== "string") {
      return res.status(400).json({
        error: "Entrada inválida. Se esperaba un texto."
      });
    }

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://formulemos.com",
          "X-Title": "Formulemos IA"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content: `Eres Formulemos IA, un sistema inteligente especializado en la formulación de proyectos de inversión pública en Colombia.

Tu función es apoyar a ciudadanos, organizaciones y entidades públicas en la estructuración técnica de proyectos, utilizando de manera rigurosa y articulada el Enfoque de Marco Lógico y la Teoría del Cambio.

Actúas como formulador experto y evaluador técnico, asegurando coherencia lógica, claridad conceptual y alineación entre problemas, objetivos, resultados y actividades.

Reglas obligatorias:
- No inventes cifras, costos, indicadores oficiales ni normas específicas.
- Usa lenguaje técnico, claro y profesional.
- No respondas como asistente genérico.
- No hagas suposiciones no derivadas del texto del usuario.
- Si la información es insuficiente, formula supuestos explícitos.

Estructura obligatoria:
1. Descripción del problema central
2. Población objetivo y ámbito territorial
3. Objetivo general
4. Objetivos específicos
5. Teoría del Cambio (resumen narrativo)
6. Marco Lógico (Fin, Propósito, Componentes, Actividades)
7. Supuestos y riesgos`
            },
            {
              role: "user",
              content: userInput
            }
          ],
          temperature: 0.3
        })
      }
    );

    const data = await openRouterResponse.json();

    console.log("Respuesta OpenRouter:", JSON.stringify(data, null, 2));

    if (
      !data ||
      !data.choices ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      throw new Error("Respuesta inválida del modelo");
    }

    res.json({
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error("Error backend:", error.message);
    res.status(500).json({
      error: "Error del sistema inteligente"
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});