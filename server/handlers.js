const { v4: uuidv4 } = require("uuid");

// Handler to get a user by id
const getUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await req.db.collection("users").findOne({ _id: userId });
    if (user) {
      res.status(200).json({ status: 200, data: user });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler to create a new user
const createUser = async (req, res) => {
  const newUser = req.body;

  if (!newUser.email) {
    return res
      .status(400)
      .json({ status: 400, message: "User must have an email" });
  }

  try {
    const existingUser = await req.db
      .collection("users")
      .findOne({ email: newUser.email });

    if (existingUser) {
      return res
        .status(400)
        .json({ status: 400, message: "User already exists" });
    }

    newUser._id = uuidv4();

    const result = await req.db.collection("users").insertOne(newUser);
    res.status(201).json({ status: 201, data: result });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler to update a user by id
const updateUserById = async (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;
  try {
    const result = await req.db
      .collection("users")
      .updateOne({ _id: userId }, { $set: updatedUser });
    if (result.matchedCount > 0) {
      res.status(200).json({ status: 200, data: result });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

// Handler to delete a user by id
const deleteUserById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await req.db.collection("users").deleteOne({ _id: userId });
    if (result.deletedCount > 0) {
      res.status(200).json({ status: 200, message: "User deleted" });
    } else {
      res.status(404).json({ status: 404, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};

module.exports = {
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
