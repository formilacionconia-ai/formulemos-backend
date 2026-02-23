import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 10000;

console.log(
  "🔑 OPENROUTER_API_KEY cargada:",
  process.env.OPENROUTER_API_KEY ? "SÍ" : "NO"
);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ reply: "Mensaje vacío" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://formulemos.com",
          "X-Title": "Formulemos IA"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-chat",
          messages: [
            {
              role: "system",
              content:
                "Eres un experto en formulación de proyectos de inversión pública con enfoque en Marco Lógico y Teoría del Cambio."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("📩 Respuesta OpenRouter:", data);

    if (!data.choices || !data.choices[0]?.message?.content) {
      return res.status(500).json({
        reply: "Respuesta inválida del sistema inteligente."
      });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    console.error("❌ Error interno:", error);
    res.status(500).json({
      reply: "Error en el sistema inteligente."
    });
  }
});

app.get("/", (req, res) => {
  res.send("🚀 Backend Formulemos IA funcionando correctamente");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});