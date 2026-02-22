import express from "express";
import cors from "cors";

const app = express();

/* =========================
   MIDDLEWARES (OBLIGATORIOS)
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RUTA DE SALUD
========================= */
app.get("/", (req, res) => {
  res.status(200).send("✅ Backend Formulemos IA activo");
});

/* =========================
   RUTA PRINCIPAL
========================= */
app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        response: "❌ El mensaje está vacío."
      });
    }

    console.log("Mensaje recibido:", message);

    return res.status(200).json({
      response: "✅ Backend activo. El mensaje fue recibido correctamente."
    });

  } catch (error) {
    console.error("ERROR EN /api/chat:", error);

    return res.status(500).json({
      response: "❌ Error interno del backend."
    });
  }
});

/* =========================
   PUERTO PARA RENDER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});