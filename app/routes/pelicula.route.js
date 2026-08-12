// app/routes/pelicula.route.js
module.exports = app => {
  const peliculas = require("../controllers/pelicula.controller.js");
  const { verifyToken } = require("../../middlewares/authJwt.js");
  var router = require("express").Router();

  // Crear una nueva película (requiere autenticación)
  router.post("/", verifyToken, peliculas.create);

  // Obtener todas las películas (público)
  router.get("/", peliculas.findAll);

  // Obtener una película por ID (público)
  router.get("/:id", peliculas.findOne);

  // Actualizar una película (requiere autenticación)
  router.put("/:id", verifyToken, peliculas.update);

  // Eliminar una película (requiere autenticación)
  router.delete("/:id", verifyToken, peliculas.delete);

  // Eliminar todas las películas (requiere autenticación, solo desarrollo)
  router.delete("/", verifyToken, peliculas.deleteAll);

  app.use("/api/peliculas", router);
};
