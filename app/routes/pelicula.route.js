
module.exports = app => {
  const peliculas = require("../controllers/pelicula.controller.js");
  const { verifyToken } = require("../../middlewares/authJwt.js");
  var router = require("express").Router();

  router.post("/", verifyToken, peliculas.create);
  router.get("/", peliculas.findAll);
  router.get("/:id", peliculas.findOne);

  router.put("/:id", verifyToken, peliculas.update);
  router.delete("/:id", verifyToken, peliculas.delete);
  router.delete("/", verifyToken, peliculas.deleteAll);

  app.use("/api/peliculas", router);
};
