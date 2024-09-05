const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { MONGO_URI } = process.env;

const dbName = "restaurantApp";
const usersCollection = "users";

const getUserById = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const userId = req.params.userId;

  try {
    await client.connect();
    const db = client.db(dbName);

    // Retrieves a user by id and excludes the password from the response data for security
    const user = await db.collection(usersCollection).findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "No user found with this ID. Please try again.",
      });
    }

    const { password, ...userData } = user;

    res.status(200).json({ status: 200, data: userData });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

const createUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields." });
  }

  try {
    await client.connect();
    const db = client.db(dbName);

    const existingUser = await db.collection(usersCollection).findOne({
      $or: [{ email }, { username }, { password }],
    });

    if (existingUser) {
      let errorMessage = "User already exists.";
      if (existingUser.email === email) {
        errorMessage = "This email is already in use. Please choose another.";
      } else if (existingUser.username === username) {
        errorMessage = "This username is already taken. Try a different one.";
      } else if (existingUser.password === password) {
        errorMessage =
          "The password you chose is already used. Please select a new one.";
      }
      return res.status(400).json({ status: 400, message: errorMessage });
    }

    // Create a new user object with a unique id, default values and initial tags
    const newUser = {
      _id: uuidv4(),
      username,
      email,
      password,
      favourites: [],
      wantToTry: [],
      tags: [
        "Sushi",
        "Italian",
        "Indian",
        "Pizza",
        "Mexican",
        "Vegetarian",
        "Dessert",
        "Fast Food",
        "Brunch",
        "Chinese",
        "Thai",
        "Café",
        "Fine Dining",
        "Healthy",
      ],
    };

    // Inserts the new user into the database
    const result = await db.collection(usersCollection).insertOne(newUser);
    res.status(201).json({
      status: 201,
      data: result,
      message: "Your account has been created successfully!",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

// Handles user login by validating email, password and checks if they match a record in the database
const loginUser = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Email and password are required." });
  }

  try {
    await client.connect();
    const db = client.db(dbName);

    const user = await db.collection(usersCollection).findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "We couldn't find an account with this email." });
    }

    if (user.password !== password) {
      return res
        .status(400)
        .json({ message: "The password you entered is incorrect." });
    }

    // Prepares user data for response, excluding password
    const userData = {
      _id: user._id,
      username: user.username,
      email: user.email,
      favourites: user.favourites,
      wantToTry: user.wantToTry,
      tags: user.tags,
    };

    return res.status(200).json({
      message: "Welcome back! You’re now logged in.",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  } finally {
    await client.close();
  }
};

module.exports = {
  getUserById,
  createUser,
  loginUser,
};
