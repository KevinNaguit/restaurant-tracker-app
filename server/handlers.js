const { v4: uuidv4 } = require("uuid");

// Handler to get a user by their id
const getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await req.db.collection("users").findOne({ _id: userId });
    if (user) {
      res.status(200).json({ status: 200, data: user });
    } else {
      res
        .status(404)
        .json({
          status: 404,
          message: "No user found this ID. Please try again.",
        });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler to create a new user
const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "Missing required fields." });
  }

  try {
    // Check if a user with the same email, username or password already exists
    const existingUser = await req.db.collection("users").findOne({
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

    // Create a new user object with a unique id
    const newUser = {
      _id: uuidv4(),
      username,
      email,
      password,
    };

    const result = await req.db.collection("users").insertOne(newUser);
    res
      .status(201)
      .json({
        status: 201,
        data: result,
        message: "Your account has been created successfully!",
      });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler to update a user by their id
const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;
  try {
    const result = await req.db
      .collection("users")
      .updateOne({ _id: userId }, { $set: updatedUser });
    if (result.matchedCount > 0) {
      res
        .status(200)
        .json({
          status: 200,
          data: result,
          message: "Your information has been updated.",
        });
    } else {
      res
        .status(404)
        .json({
          status: 404,
          message: "We couldn’t find the user to update. Please try again.",
        });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler to delete a user by their id
const deleteUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await req.db.collection("users").deleteOne({ _id: userId });
    if (result.deletedCount > 0) {
      res
        .status(200)
        .json({
          status: 200,
          message: "The user has been removed successfully.",
        });
    } else {
      res
        .status(404)
        .json({
          status: 404,
          message: "We couldn’t locate the user to delete. Please try again.",
        });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await req.db.collection("users").findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "We couldn't find an an account with this email." });
    }

    // Check if the provided password matches the stored password
    if (user.password !== password) {
      return res
        .status(400)
        .json({ message: "The password you entered is incorrect." });
    }

    res
      .status(200)
      .json({
        message: "Welcome back! You’re now logged in.",
        userId: user._id,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
  loginUser,
};
