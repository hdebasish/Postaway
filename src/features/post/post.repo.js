import { ObjectId } from "mongodb";
import { getDB } from "./../../config/mongodb.js";

export default class PostRepo {
  constructor() {
    this.collection = "posts";
  }

  async getAllPosts() {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const out = await collection.aggregate([
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "commentDetails"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "commentDetails.userId",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $project: {
            _id: 1,
            imageUrl: 1,
            caption: 1,
            commentDetails: {
              content: 1,
              userId: 1,
              user: {
                $arrayElemAt: ["$userDetails.name", 0]
              }
            }
          }
        }
      ]);
      return out.toArray();
    } catch (error) {
      throw error;
    }
  }

  async getPostByUser(userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.aggregate([
        {
          $match: { userId: new ObjectId(userId) } 
        },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "commentDetails"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "commentDetails.userId",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $project: {
            _id: 1,
            imageUrl: 1,
            caption: 1,
            commentDetails: {
              content: 1,
              userId: 1,
              user: {
                $arrayElemAt: ["$userDetails.name", 0]
              }
            }
          }
        }
      ]).toArray();
    } catch (error) {
      throw error;
    }
  }

  async getPostById(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.aggregate([
        {
          $match: { _id: new ObjectId(id) } 
        },
        {
          $lookup: {
            from: "comments",
            localField: "comments",
            foreignField: "_id",
            as: "commentDetails"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "commentDetails.userId",
            foreignField: "_id",
            as: "userDetails"
          }
        },
        {
          $project: {
            _id: 1,
            imageUrl: 1,
            caption: 1,
            commentDetails: {
              content: 1,
              userId: 1,
              user: {
                $arrayElemAt: ["$userDetails.name", 0]
              }
            }
          }
        }
      ]).toArray();
    } catch (error) {
      throw error;
    }
  }

  async addPost(post) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.insertOne(post);
    } catch (error) {
      throw error;
    }
  }

  async updatePostById(postId, userId, caption, imageUrl) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      let expression = {};

      if (caption) {
        expression.caption = caption;
      }

      if (imageUrl) {
        expression.imageUrl = imageUrl;
      }

      return await collection.updateOne(
        {
          _id: new ObjectId(postId),
          userId: new ObjectId(userId),
        },
        {
          $set: expression,
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async deletePostById(postId, userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.deleteOne({
        _id: new ObjectId(postId),
        userId: new ObjectId(userId),
      });
    } catch (error) {
      throw error;
    }
  }
}
