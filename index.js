import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/* ======================
   MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   RUTA BASE
====================== */
app.get("/", (req, res) => {
  res.send("✅ Backend Formulemos IA con DeepSeek activo");
});

/* ======================
   API CHAT (DEEPSEEK)
====================== */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        reply: "❌ El mensaje está vacío",
      });
    }

    const prompt = `
Eres un asistente experto en formulación de proyectos de inversión pública.
A partir de la siguiente idea, formula un proyecto estructurado con:

- Problema
- Objetivo general
- Objetivos específicos
- Componentes
- Resultados esperados

Idea del proyecto:
${message}

Responde en español y de forma clara y estructurada.
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]) {
      throw new Error("Respuesta inválida de DeepSeek");
    }

    res.status(200).json({
      reply: data.choices[0].message.content,
    });

  } catch (error) {
    console.error("❌ Error DeepSeek:", error);
    res.status(500).json({
      reply: "❌ Error al conectar con el sistema inteligente",
    });
  }
});

/* ======================
   SERVIDOR
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});