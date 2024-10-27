import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";

export default class ProfileRepo {
  constructor() {
    this.collection = "users";
  }

  async getAll() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const output = await collection.aggregate([
        {
          $project: { name: 1, email: 1, gender: 1 },
        },
      ]);
      return output.toArray();
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const output = await collection.aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $project: { name: 1, email: 1, gender: 1 },
        },
      ]);
      return output.toArray();
    } catch (error) {
      throw error;
    }
  }

  async update(id, name, email, gender) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const expression = {};

      if (name) {
        expression.name = name;
      }

      if (email) {
        expression.email = email;
      }

      if (gender) {
        expression.gender = gender;
      }

      const output = await collection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: expression,
        }
      );
      return output;
    } catch (error) {
      throw error;
    }
  }

  async removeToken(userId, token) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { tokens: token } }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeAllToken(userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        { $unset: { tokens: "" } }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }
}
