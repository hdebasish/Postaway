import { ObjectId } from "mongodb";
import { getDB } from "../../../config/mongodb.js";

export default class AuthRepo {
  constructor() {
    this.collection = "users";
  }

  async signup(user) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.insertOne(user);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const user = await collection.findOne({ email });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async saveToken(id, token) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $push: { tokens: token } }
      );

      if (result.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }
}
