const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { MONGO_URI } = process.env;

const dbName = "restaurantApp";
const restaurantsCollection = "restaurants";
const usersCollection = "users";

// Handler to create a new restaurant for a user, validate input and
// update the user's list (favourites or wantToTry)
const createRestaurant = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const { name, number, address, website, notes, userId, listType } = req.body;

  if (!name || !userId || !listType) {
    return res.status(400).json({
      status: 400,
      message: "Name, user ID, and list type are required.",
    });
  }

  try {
    await client.connect();
    const db = client.db(dbName);

    const user = await db.collection(usersCollection).findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found. Please check the user ID.",
      });
    }

    // Creates a new restaurant object with a unique id and inserts into the restaurants
    // collection in the database
    const newRestaurant = {
      _id: uuidv4(),
      name,
      number,
      address,
      website,
      notes,
      userId,
      listType,
      tags: [],
    };

    const result = await db
      .collection(restaurantsCollection)
      .insertOne(newRestaurant);

    // If the new restaurant is successfully added to the database, update the user's list
    // (either favourites or wantToTry) with the new restaurant
    if (result.acknowledged) {
      const updateField =
        listType === "favourites" ? "favourites" : "wantToTry";

      await db
        .collection(usersCollection)
        .updateOne(
          { _id: userId },
          { $push: { [updateField]: newRestaurant } }
        );

      // Convert the _id to a string so it can be included in the response data
      res.status(201).json({
        status: 201,
        data: { ...newRestaurant, _id: result.insertedId.toString() },
        message: "Restaurant added successfully!",
      });
    } else {
      res
        .status(500)
        .json({ status: 500, message: "Failed to add restaurant." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

// Handler to retrieve all restaurants for a specific user based on their
// userId and list type (favourites or wantToTry)
const getRestaurantsByUserId = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const userId = req.params.userId;
  const listType = req.query.listType;

  if (!listType) {
    return res
      .status(400)
      .json({ status: 400, message: "List type is required." });
  }

  try {
    await client.connect();
    const db = client.db(dbName);

    const user = await db.collection(usersCollection).findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found. Please check the user ID.",
      });
    }

    // Find restaurants by userId and listType
    const restaurants = await db
      .collection(restaurantsCollection)
      .find({ userId, listType })
      .toArray();

    if (restaurants.length > 0) {
      res.status(200).json({ status: 200, data: restaurants });
    } else {
      res.status(404).json({
        status: 404,
        message: "No restaurants found for this user in the specified list.",
      });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

// Handler to delete a restaurant from a user's list and remove it
// from the restaurants collection in the database
const deleteRestaurant = async (req, res) => {
  const { _id, listType } = req.body;

  if (!_id || !listType) {
    console.log("Missing parameters:", { _id, listType });
    return res.status(400).json({
      status: 400,
      message: "Restaurant ID and list type are required",
    });
  }

  console.log("Request Data:", { _id, listType });

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Find the user who has the restaurant in their list
    const user = await db.collection(usersCollection).findOne({
      [`${listType}`]: { $elemMatch: { _id } }, // Check if restaurant with the given _id is in the listType
    });

    console.log("User found:", user);

    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: "Restaurant not found in user's list" });
    }

    // Remove the restaurant from the user's list
    const result = await db.collection(usersCollection).updateOne(
      { _id: user._id },
      { $pull: { [`${listType}`]: { _id } } } // Remove the restaurant with the given _id from the listType
    );

    console.log("Update result:", result);

    if (result.modifiedCount === 0) {
      return res.status(500).json({
        status: 500,
        message: "Failed to remove the restaurant from the list",
      });
    }

    // Delete the restaurant from the restaurants collection
    await db.collection(restaurantsCollection).deleteOne({ _id });

    res
      .status(200)
      .json({ status: 200, message: "Restaurant removed successfully" });
  } catch (err) {
    console.error("Error in deleteRestaurant:", err);
    res.status(502).json({ status: 502, message: err.message });
  } finally {
    await client.close();
  }
};

// Handler to move a restaurant from from favourites to wantToTry for a specific user
const moveRestaurantToList = async (req, res) => {
  const { _id, fromList, toList } = req.body;

  if (!_id || !fromList || !toList) {
    return res.status(400).json({
      status: 400,
      message: "Restaurant ID, fromList, and toList are required",
    });
  }

  // Validate toList
  if (!["favourites", "wantToTry"].includes(toList)) {
    return res.status(400).json({ status: 400, message: "Invalid list type" });
  }

  const client = new MongoClient(MONGO_URI);

  try {
    await client.connect();
    const db = client.db(dbName);

    // Find the restaurant in the database
    const restaurant = await db
      .collection(restaurantsCollection)
      .findOne({ _id });

    if (!restaurant) {
      return res
        .status(404)
        .json({ status: 404, message: "Restaurant not found" });
    }

    // Find the user associated with the restaurant
    const user = await db
      .collection(usersCollection)
      .findOne({ _id: restaurant.userId });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    // Update the listType of the restaurant
    const result = await db
      .collection(restaurantsCollection)
      .updateOne({ _id }, { $set: { listType: toList } });

    if (result.modifiedCount === 0) {
      return res.status(500).json({
        status: 500,
        message: "Failed to update restaurant list type",
      });
    }

    // Remove the restaurant from the old list
    await db
      .collection(usersCollection)
      .updateOne({ _id: user._id }, { $pull: { [fromList]: { _id } } });

    // Add the restaurant to the new list
    await db
      .collection(usersCollection)
      .updateOne({ _id: user._id }, { $push: { [toList]: { _id } } });

    res
      .status(200)
      .json({ status: 200, message: "Restaurant moved successfully" });
  } catch (err) {
    console.error("Error in moveRestaurantToList:", err);
    res.status(500).json({ status: 500, message: err.message });
  } finally {
    await client.close();
  }
};

module.exports = {
  getRestaurantsByUserId,
  createRestaurant,
  deleteRestaurant,
  moveRestaurantToList,
};
