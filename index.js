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
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Mensaje inválido" });
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
                "Eres un asistente experto en formulación de proyectos de inversión pública y social, especializado en Marco Lógico y Teoría del Cambio. Debes estructurar respuestas claras, técnicas y aplicables al contexto colombiano."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.3
        })
      }
    );

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
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