// app/controllers/auth.controller.js
const db = require("../models");
const config = require("../config/db.config.js/auth.config.js");
const Usuario = db.usuarios;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


exports.signup = (req, res) => {
  if (!req.body.username || !req.body.email || !req.body.password) {
    return res.status(400).send({
      message: "username, email y password son obligatorios."
    });
  }

  
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);

  Usuario.create({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword
  })
    .then(usuario => {
      res.send({ message: "Usuario registrado exitosamente!", id: usuario.id });
    })
    .catch(err => {
      console.error("Signup error:", err);

      if (err.name === "SequelizeUniqueConstraintError" || err.parent?.code === "23505") {
        return res.status(409).send({
          message: "Username o email ya existen. Usa datos diferentes."
        });
      }

      res.status(500).send({
        message: err.message || "Ocurrió un error al registrar el usuario."
      });
    });
};


exports.signin = (req, res) => {
  Usuario.findOne({
    where: { username: req.body.username }
  })
    .then(usuario => {
      
      if (!usuario) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      
      const passwordEsValida = bcrypt.compareSync(req.body.password, usuario.password);
      if (!passwordEsValida) {
        return res.status(401).send({ message: "Contraseña incorrecta." });
      }

     
      const token = jwt.sign({ id: usuario.id }, config.secret, {
        expiresIn: config.expiresIn 
      });

      res.status(200).send({
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        accessToken: token,
        expiresIn: config.expiresIn
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message || "Ocurrió un error al iniciar sesión." });
    });
};