import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

console.log("🔑 OPENROUTER_API_KEY cargada:", !!process.env.OPENROUTER_API_KEY);
console.log("🚀 Backend activo en puerto", PORT);

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
              content:
                "Eres un asistente experto en formulación de proyectos usando Marco Lógico y Teoría del Cambio."
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

    console.log("📦 Respuesta OpenRouter:", JSON.stringify(data, null, 2));

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Respuesta inválida de OpenRouter");
    }

    res.json({
      response: data.choices[0].message.content
    });
  } catch (error) {
    console.error("❌ Error backend:", error.message);
    res.status(500).json({
      error: "Error del sistema inteligente"
    });
  }
});

app.listen(PORT, () => {
  console.log("✅ Servidor escuchando en puerto", PORT);
});