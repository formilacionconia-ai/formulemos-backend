import express from "express";
import cors from "cors";

const app = express();

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RUTA DE PRUEBA (SALUD)
========================= */
app.get("/", (req, res) => {
  res.send("✅ Backend Formulemos IA activo");
});

/* =========================
   RUTA PRINCIPAL (PRUEBA SIN IA)
========================= */
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    console.log("Mensaje recibido:", message);

    return res.json({
      response: "✅ Backend activo. El mensaje fue recibido correctamente."
    });

  } catch (error) {
    console.error("Error en /api/chat:", error);
    return res.status(500).json({
      response: "❌ Error interno del backend."
    });
  }
});

/* =========================
   PUERTO (OBLIGATORIO RENDER)
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor Formulemos IA escuchando en puerto ${PORT}`);
});