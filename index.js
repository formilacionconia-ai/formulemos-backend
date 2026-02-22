import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

/* ======================
   MIDDLEWARES
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   RUTA DE PRUEBA
====================== */
app.get("/", (req, res) => {
  res.send("✅ Backend Formulemos IA activo");
});

/* ======================
   API CHAT (SIMULADA)
====================== */
app.post("/api/chat", (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        reply: "❌ El mensaje está vacío",
      });
    }

    // RESPUESTA SIMULADA (como si fuera IA)
    const simulatedResponse = {
      titulo_proyecto: "Mejoramiento del acceso al agua potable en zona rural",

      problema: `La comunidad presenta dificultades en el acceso continuo y seguro al agua potable, lo que afecta la salud, el bienestar y el desarrollo social de sus habitantes.`,

      objetivo_general:
        "Mejorar el acceso al agua potable en comunidades rurales mediante la implementación de soluciones sostenibles de abastecimiento.",

      objetivos_especificos: [
        "Diagnosticar la situación actual del acceso al agua en la comunidad.",
        "Diseñar una solución técnica adecuada para el abastecimiento de agua potable.",
        "Implementar infraestructura básica para la captación y distribución de agua.",
        "Fortalecer las capacidades comunitarias para la gestión del sistema.",
      ],

      componentes: [
        {
          nombre: "Diagnóstico participativo",
          descripcion:
            "Identificación de necesidades, fuentes hídricas y condiciones actuales del servicio.",
        },
        {
          nombre: "Infraestructura de abastecimiento",
          descripcion:
            "Construcción o adecuación de sistemas de captación, almacenamiento y distribución de agua.",
        },
        {
          nombre: "Gestión comunitaria",
          descripcion:
            "Capacitación a la comunidad para la operación y mantenimiento del sistema.",
        },
      ],

      resultados_esperados: [
        "Comunidad con acceso continuo a agua potable.",
        "Reducción de enfermedades de origen hídrico.",
        "Mejora en la calidad de vida de los habitantes.",
      ],
    };

    res.status(200).json({
      reply: simulatedResponse,
    });
  } catch (error) {
    console.error("Error en /api/chat:", error);
    res.status(500).json({
      reply: "❌ Error interno del servidor",
    });
  }
});

/* ======================
   SERVIDOR
====================== */
app.listen(PORT, () => {
  console.log(`🚀 Backend activo en puerto ${PORT}`);
});