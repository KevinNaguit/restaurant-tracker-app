const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { MONGO_URI } = process.env;
const dbName = "restaurantApp";
const tagsCollection = "tags";
const usersCollection = "users";

// Handler to retrieve all tags associated with a specific user by their userId
const getTagsByUserId = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const userId = req.params.userId;

  try {
    await client.connect();
    const db = client.db(dbName);

    const user = await db.collection(usersCollection).findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found." });
    }

    if (!user.tags || user.tags.length === 0) {
      return res.status(200).json({ status: 200, data: [] });
    }

    // Fetch tags by UUID list
    const tags = await db
      .collection(tagsCollection)
      .find({ _id: { $in: user.tags.map((tag) => tag.toString()) } }) // Convert UUIDs to strings
      .toArray();

    // Convert _id to string before sending response
    res.status(200).json({
      status: 200,
      data: tags.map((tag) => ({
        ...tag,
        _id: tag._id.toString(), // Ensure _id is in string format
      })),
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

// Handler to create a new tag and associate it with a specific user
const createTag = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const { name, userId } = req.body;

  if (!name || !userId) {
    return res
      .status(400)
      .json({ status: 400, message: "Name and user ID are required." });
  }

  try {
    await client.connect();
    const db = client.db(dbName);

    const newTag = {
      _id: uuidv4(),
      name,
      userId,
    };

    // Insert the new tag into the tags collection
    const result = await db.collection(tagsCollection).insertOne(newTag);

    if (result.acknowledged) {
      // Update the user's tags list with the new tag UUID
      const updateResult = await db
        .collection(usersCollection)
        .updateOne({ _id: userId }, { $addToSet: { tags: newTag._id } });

      if (updateResult.modifiedCount === 0) {
        return res
          .status(500)
          .json({ status: 500, message: "Failed to update user's tags list." });
      }

      res.status(201).json({
        status: 201,
        data: { ...newTag, _id: newTag._id.toString() }, // UUID remains in string format
        message: "Tag added successfully!",
      });
    } else {
      res.status(500).json({ status: 500, message: "Failed to add tag." });
    }
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

// Handler to delete a tag
// Still working on this handler, removing the tag from specific users' tag lists, etc.
const deleteTag = async (req, res) => {
  const client = new MongoClient(MONGO_URI);
  const tagId = req.params.id;

  try {
    await client.connect();
    const db = client.db(dbName);

    const tagDeletionResult = await db
      .collection(tagsCollection)
      .deleteOne({ _id: tagId });
    if (tagDeletionResult.deletedCount === 0) {
      return res.status(404).json({ status: 404, message: "Tag not found." });
    }

    const userUpdateResult = await db
      .collection(usersCollection)
      .updateMany({ tags: tagId }, { $pull: { tags: tagId } });

    if (userUpdateResult.modifiedCount === 0) {
      console.log(
        "No users updated. This may mean the tag was not in any user's list."
      );
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  } finally {
    await client.close();
  }
};

module.exports = {
  getTagsByUserId,
  createTag,
  deleteTag,
};
