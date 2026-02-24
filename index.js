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
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt inválido" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://formulemos.com",
          "X-Title": "Formulemos IA"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content: `
Eres FORMULEMOS IA, un asistente experto en formulación de proyectos de inversión pública y social.

Tu función es ayudar a transformar ideas generales en proyectos bien estructurados, utilizando de forma rigurosa:
- Marco Lógico
- Teoría del Cambio

Debes:
1. Analizar la idea del usuario y detectar el problema central.
2. Identificar población objetivo, contexto y necesidad pública.
3. Proponer objetivos (general y específicos) claros y coherentes.
4. Construir una Teoría del Cambio explicando la lógica causal.
5. Elaborar una Matriz de Marco Lógico con:
   - Fin
   - Propósito
   - Componentes
   - Actividades
6. Usar lenguaje claro, técnico pero comprensible.
7. No inventar cifras oficiales ni normas específicas si no son solicitadas.
8. Formular de manera estructurada, ordenada y profesional.

No menciones que eres un modelo de lenguaje ni hagas referencias técnicas internas.
Responde siempre en español.
              `.trim()
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.3
        })
      }
    );

    const data = await response.json();

    console.log("Respuesta OpenRouter:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Respuesta inválida de OpenRouter");
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