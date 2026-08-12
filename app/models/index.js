
const dbConfig = require("../config/db.config.js/db.config.js");


const Sequelize = require("sequelize");

const sequelizeOptions = {
  dialect: dbConfig.dialect,
  dialectOptions: {
    ssl: dbConfig.ssl
  },
  pool: dbConfig.pool
};

const sequelize = dbConfig.DATABASE_URL
  ? new Sequelize(dbConfig.DATABASE_URL, sequelizeOptions)
  : new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
      host: dbConfig.HOST,
      ...sequelizeOptions
    });


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.usuarios = require("./usuario.model.js")(sequelize, Sequelize);
db.peliculas = require("./pelicula.model.js")(sequelize, Sequelize);


module.exports = db;