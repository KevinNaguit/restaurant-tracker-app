const express = require("express");
const morgan = require("morgan");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const { MONGO_URI } = process.env;
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(morgan("dev"));

const client = new MongoClient(MONGO_URI);

const {
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
} = require("./handlers");

// Middleware to attach db to req
app.use((req, res, next) => {
  req.db = db; // Attach db to request object
  next();
});

// Connect to MongoDB
client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    db = client.db("restaurantApp");
    app.locals.db = db; // Make the db available to all route handlers through app.locals
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });

// Route to get a user by id
app.get("/users/:userId", getUserById);

// Route to create a new user
app.post("/users", createUser);

// Route to update a user by id
app.put("/users/:userId", updateUserById);

// Route to delete a user by id
app.delete("/users/:userId", deleteUserById);

// Test route to verify connection
// app.get("/test", (req, res) => {
//   res.send("Hello from the backend");
// });

app.get("/*", (req, res) => {
  res.send("This isn't the endpoint you're looking for");
});

app.listen(PORT, () => {
  console.log("Backend running at:", PORT);
});
