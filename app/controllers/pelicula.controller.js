// app/controllers/pelicula.controller.js
const db = require("../models");
const Pelicula = db.peliculas;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
  if (!req.body.nombre || !req.body.duracion || !req.body.tipo || !req.body.categoria || !req.body.anioLanzamiento) {
    return res.status(400).send({
      message: "nombre, duracion, tipo, categoria y anioLanzamiento son obligatorios."
    });
  }

  const pelicula = {
    nombre: req.body.nombre,
    sinopsis: req.body.sinopsis,
    actores: req.body.actores,
    duracion: req.body.duracion,
    tipo: req.body.tipo,
    categoria: req.body.categoria,
    anioLanzamiento: req.body.anioLanzamiento,
    calificacion: req.body.calificacion || 0,
    activo: req.body.activo !== undefined ? req.body.activo : true
  };

  Pelicula.create(pelicula)
    .then(data => {
      res.status(201).send({
        message: "Película creada exitosamente.",
        data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al crear la película."
      });
    });
};


exports.findAll = (req, res) => {
  const nombre = req.query.nombre;
  const categoria = req.query.categoria;
  const tipo = req.query.tipo;
  
  let condition = {};
  
  if (nombre) {
    condition.nombre = { [Op.iLike]: `%${nombre}%` };
  }
  if (categoria) {
    condition.categoria = { [Op.iLike]: `%${categoria}%` };
  }
  if (tipo) {
    condition.tipo = tipo;
  }

  Pelicula.findAll({ 
    where: condition,
    order: [['createdAt', 'DESC']]
  })
    .then(data => {
      res.status(200).send({
        message: "Películas obtenidas exitosamente.",
        total: data.length,
        data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al obtener las películas."
      });
    });
};


exports.findOne = (req, res) => {
  const id = req.params.id;

  Pelicula.findByPk(id)
    .then(data => {
      if (!data) {
        return res.status(404).send({
          message: "Película no encontrada con id=" + id
        });
      }
      res.status(200).send({
        message: "Película obtenida exitosamente.",
        data: data
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al obtener la película."
      });
    });
};


exports.update = (req, res) => {
  const id = req.params.id;

  Pelicula.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        Pelicula.findByPk(id)
          .then(data => {
            res.status(200).send({
              message: "Película actualizada exitosamente.",
              data: data
            });
          });
      } else {
        res.status(404).send({
          message: "Película no encontrada o no se proporcionaron datos para actualizar."
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al actualizar la película."
      });
    });
};


exports.delete = (req, res) => {
  const id = req.params.id;

  Pelicula.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({
          message: "Película eliminada exitosamente."
        });
      } else {
        res.status(404).send({
          message: "Película no encontrada con id=" + id
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al eliminar la película."
      });
    });
};

exports.deleteAll = (req, res) => {
  Pelicula.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.status(200).send({
        message: `Se eliminaron ${nums} películas.`
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Error al eliminar todas las películas."
      });
    });
};
