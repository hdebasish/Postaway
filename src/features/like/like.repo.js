import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";

export default class LikeRepo {
  constructor() {
    this.collection = "likes";
  }

  async like(likeData) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const liked = await collection.findOne({
        userId: new ObjectId(likeData.userId),
        likeable: new ObjectId(likeData.likeable),
      });

      if (liked) {
        const unlike = await collection.deleteOne({
          userId: new ObjectId(likeData.userId),
          likeable: new ObjectId(likeData.likeable),
        });

        if (unlike.deletedCount > 0) {
          if (likeData.type == "Post") {
            const result = await db
              .collection("posts")
              .updateOne(
                { _id: new ObjectId(likeData.likeable) },
                { $inc: { likeCount: -1 } }
              );
          } else {
            const result = await db
              .collection("comments")
              .updateOne(
                { _id: new ObjectId(likeData.likeable) },
                { $inc: { likeCount: -1 } }
              );
          }

          return "unliked";
        } else {
          return;
        }
      } else {
        const like = await collection.insertOne(likeData);

        if (like) {
          if (likeData.type == "Post") {
            const result = await db
              .collection("posts")
              .updateOne(
                { _id: new ObjectId(likeData.likeable) },
                { $inc: { likeCount: 1 } }
              );
          } else {
            const result = await db
              .collection("comments")
              .updateOne(
                { _id: new ObjectId(likeData.likeable) },
                { $inc: { likeCount: 1 } }
              );
          }

          return "liked";
        } else {
          return;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const pipeline = [
        { $match: { likeable: new ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_info",
          },
        },
        { $unwind: "$user_info" },
        {
          $project: {
            likeable: 1,
            type: 1,
            userId: "$user_info._id",
            name: "$user_info.name",
            email: "$user_info.email",
          },
        },
      ];

      return await collection.aggregate(pipeline).toArray();
    } catch (error) {
      throw error;
    }
  }

  async findPostById(id) {
    try {
      const db = getDB();
      const collection = db.collection("posts");

      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }

  async findCommentById(id) {
    try {
      const db = getDB();
      const collection = db.collection("comments");

      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }
}
