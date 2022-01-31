const express = require("express");
var cors = require("cors");
const app = express();
const cron = require("node-cron");
const axios = require("axios");

const port = process.env.PORT || 3000;

app.use(cors());

cron.schedule("* * * * *", () => {
  console.log("updating balance every minute");
  axios
    .post("https://cryptodice1.herokuapp.com/updateBalance", {})
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

app.listen(port, () => console.log(`Server Started on port ${port}...`));
