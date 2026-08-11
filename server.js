const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();


app.get("/", (req, res) => {
  res.json({ message: "primer parcial Francisco Rene Samayoa Valle SI FUNCO" });
});

require("./app/routes/cliente.route")(app);
require("./app/routes/auth.route")(app);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

app.post("/api/pago/webhook", express.raw({ type: "application/json" }),
  require("./app/controllers/pago.controller.js").webhook
);


app.use(bodyParser.json());
require("./app/routes/pago.route")(app); 