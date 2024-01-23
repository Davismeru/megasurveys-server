const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

app.use("/uploads", express.static("uploads"));

// routers
const freelancerRouter = require("./routes/freelancers");
app.use("/freelancer", freelancerRouter);

const clientRouter = require("./routes/clients");
app.use("/client", clientRouter);

const db = require("./models");

db.sequelize.sync({ alter: true }).then(() => {
  app.listen(3000, () => {
    console.log("app running");
  });
});
