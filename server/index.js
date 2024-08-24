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
  loginUser,
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

// Route to get a user by their id
app.get("/users/:userId", getUserById);

// Route to create a new user
app.post("/users", createUser);

// Route to update a user's information by their id
app.put("/users/:userId", updateUserById);

// Route to delete a user by their id
app.delete("/users/:userId", deleteUserById);

// Route for user login
app.post("/login", loginUser);

// Test route to verify connection
// app.get("/test", (req, res) => {
//   res.send("Hello from the backend");
// });

// Catch-all route for any undefined endpoints
app.get("/*", (req, res) => {
  res.send("This isn't the endpoint you're looking for");
});

app.listen(PORT, () => {
  console.log("Backend running at:", PORT);
});
