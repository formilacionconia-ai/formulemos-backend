import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log("🔑 OPENROUTER_API_KEY cargada:", OPENROUTER_API_KEY ? "SÍ" : "NO");

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Mensaje requerido" });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres un asistente experto en formulación de proyectos con Marco Lógico y Teoría del Cambio."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log("📨 Respuesta OpenRouter:", data);

    if (!data.choices || !data.choices[0]) {
      throw new Error("Respuesta inválida del modelo");
    }

    res.json({
      response: data.choices[0].message.content
    });

  } catch (error) {
    console.error("❌ Error backend:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

app.listen(PORT, () => {
  console.log("🚀 Backend activo en puerto", PORT);
});