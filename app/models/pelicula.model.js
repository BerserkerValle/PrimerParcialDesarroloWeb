// app/models/pelicula.model.js
module.exports = (sequelize, Sequelize) => {
  const Pelicula = sequelize.define("pelicula", {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    sinopsis: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    actores: {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Actores separados por comas"
    },
    duracion: {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: "Duración en minutos"
    },
    tipo: {
      type: Sequelize.ENUM("Serie", "Película"),
      allowNull: false
    },
    categoria: {
      type: Sequelize.STRING,
      allowNull: false
    },
    anioLanzamiento: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    calificacion: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    activo: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true
  });
  
  return Pelicula;
};
