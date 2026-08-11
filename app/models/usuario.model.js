// app/models/usuario.model.js
module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define("usuario", {
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
    
      type: Sequelize.STRING,
      allowNull: false
    }
  });
  return Usuario;
};