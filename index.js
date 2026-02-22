import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RUTA BASE (TEST)
========================= */
app.get("/", (req, res) => {
  res.send("✅ Backend Formulemos IA con DeepSeek activo");
});

/* =========================
   API CHAT (DEEPSEEK)
========================= */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Validación básica
    if (!message || message.trim() === "") {
      return res.status(400).json({
        reply: "❌ El mensaje está vacío",
      });
    }

    // Prompt base (luego lo refinamos para Marco Lógico)
    const prompt = `
Eres un asistente experto en formulación de proyectos de inversión pública.

A partir de la siguiente idea, formula un proyecto con:
- Problema
- Objetivo general
- Objetivos específicos
- Componentes
- Resultados esperados

Idea del proyecto:
${message}

Responde en español, de forma clara y estructurada.
`;

    // Llamada a OpenRouter / DeepSeek
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://formulemos.com",
          "X-Title": "Formulemos IA",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    // 🔍 Log completo para depuración (muy útil académicamente)
    console.log("📦 Respuesta DeepSeek:", JSON.stringify(data, null, 2));

    let reply = "";

    // Formato OpenAI clásico
    if (data.choices?.[0]?.message?.content) {
      reply = data.choices[0].message.content;
    }
    // Formato alternativo
    else if (data.choices?.[0]?.text) {
      reply = data.choices[0].text;
    }
    // Formato delta (stream-like)
    else if (data.choices?.[0]?.delta?.content) {
      reply = data.choices[0].delta.content;
    }

    if (!reply) {
      reply =
        "⚠️ La IA respondió, pero el contenido no pudo interpretarse correctamente.";
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Error DeepSeek:", error);
    return res.status(500).json({
      reply: "❌ Error al conectar con el sistema inteligente",
    });
  }
});

/* =========================
   SERVIDOR
========================= */
app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});