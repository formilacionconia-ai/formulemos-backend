import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 Ruta de prueba (para navegador)
app.get("/", (req, res) => {
  res.send("✅ Backend Formulemos IA funcionando correctamente");
});

// 🤖 Ruta de IA
app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ reply: "Mensaje vacío" });
    }

    const response = await axios.post(
      "https://api.deepseek.com/v1/chat/completions",
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "Eres un experto en formulación de proyectos de inversión pública con enfoque en Marco Lógico y Teoría del Cambio."
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });
  } catch (error) {
    console.error("❌ ERROR DEEPSEEK:", error.response?.data || error.message);

    res.status(500).json({
      reply: "Error en el sistema inteligente."
    });
  }
});

// 🚀 Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});
