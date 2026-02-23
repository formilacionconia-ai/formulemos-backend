import express from "express";
import cors from "cors";

const app = express();
console.log(
  "🔑 OPENROUTER_API_KEY cargada:",
  process.env.OPENROUTER_API_KEY ? "SÍ" : "NO"
);

/* =========================
   CONFIGURACIÓN BÁSICA
========================= */

app.use(cors({
  origin: "*", // puedes restringir luego a formulemos.com
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const PORT = process.env.PORT || 10000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/* =========================
   RUTA DE PRUEBA
========================= */

app.get("/", (req, res) => {
  res.send("✅ Backend Formulemos IA con DeepSeek activo");
});

/* =========================
   RUTA PRINCIPAL IA
========================= */

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    // Validación básica
    if (!message || message.trim() === "") {
      return res.status(400).json({
        reply: "❌ El mensaje está vacío."
      });
    }

    // Llamada a OpenRouter (DeepSeek)
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
                "Eres un asistente experto en formulación de proyectos de inversión pública usando Marco Lógico y Teoría del Cambio."
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

    // Validación estricta de respuesta DeepSeek
    if (
      !data ||
      !data.choices ||
      !Array.isArray(data.choices) ||
      !data.choices[0] ||
      !data.choices[0].message ||
      !data.choices[0].message.content
    ) {
      console.error("❌ Respuesta inválida de DeepSeek:", data);
      return res.status(500).json({
        reply: "❌ Error: respuesta inválida del modelo IA."
      });
    }

    // Respuesta exitosa
    return res.json({
      reply: data.choices[0].message.content
    });

  } catch (error) {
    console.error("❌ Error en backend IA:", error);
    return res.status(500).json({
      reply: "❌ Error interno del sistema inteligente."
    });
  }
});

/* =========================
   INICIAR SERVIDOR
========================= */

app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});