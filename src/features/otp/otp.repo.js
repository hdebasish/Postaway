import { ObjectId } from "mongodb";
import { getDB } from "./../../config/mongodb.js";

export default class OTPRepository {
  constructor() {
    this.collection = "otps";
  }

  async createOtp(otp) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection.insertOne(otp);
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const db = getDB();
      const collection = db.collection("users");
      return await collection.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async findOtpByEmail(email) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  async deleteDoc(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  async updateOtp(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { isVerified: true } }
      );
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(otpid, email, newPassword) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const result = await db
        .collection("users")
        .updateOne({ email: email }, { $set: { password: newPassword } });
      if (result.modifiedCount > 0) {
        return await collection.deleteOne({ _id: new ObjectId(otpid) });
      }
    } catch (error) {
      throw error;
    }
  }
}
