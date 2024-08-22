const express = require("express");
const morgan = require("morgan");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;

const PORT = 8080;

const app = express();

app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello from the backend");
});

app.get("/*", (req, res) => {
  res.send("This isn't the endpoint you're looking for");
});

app.listen(PORT, () => {
  console.log("Backend running at: ", PORT);
});
