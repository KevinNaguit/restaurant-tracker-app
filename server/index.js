const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

const { MONGO_URI } = process.env;
const PORT = 8080;

const app = express();
app.use(express.json());
app.use(morgan("dev"));

// Import route handlers for users, restaurants and tags
const { getUserById, createUser, loginUser } = require("./handlers/users");
const {
  getRestaurantsByUserId,
  createRestaurant,
  deleteRestaurant,
  moveRestaurantToList,
} = require("./handlers/restaurants");
const { getTagsByUserId, createTag, deleteTag } = require("./handlers/tags");

// User routes
app.get("/users/:userId", getUserById);
app.post("/newUser", createUser);
app.post("/login", loginUser);

// Restaurants routes
app.get("/restaurants/:userId", getRestaurantsByUserId);
app.post("/restaurants", createRestaurant);
app.delete("/restaurants", deleteRestaurant);
app.post("/restaurants/move", moveRestaurantToList);

// Tags routes
app.get("/tags/:userId", getTagsByUserId);
app.post("/tags", createTag);
app.delete("/tags/:id", deleteTag);

// Catch-all route for undefined endpoints
app.get("/*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This isn't the endpoint you're looking for",
  });
});

app.listen(PORT, () => {
  console.log("Backend running at:", PORT);
});
