const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// CORS configuration - permite cualquier origen en desarrollo, especificar en producción
var corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sincronizar base de datos
const db = require("./app/models");
db.sequelize.sync();

// Ruta raíz
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "API Netflix - Francisco Rene Samayoa Valle",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      peliculas: "/api/peliculas"
    }
  });
});

// Rutas
require("./app/routes/auth.route")(app);
require("./app/routes/pelicula.route")(app);

// Health check para Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
 