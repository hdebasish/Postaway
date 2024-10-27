import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";

export default class CommentRepo {
  constructor() {
    this.collection = "comments";
  }

  async add(comment) {
    try {
      const db = getDB();
      const postId = comment.postId;
      const post = await db
        .collection("posts")
        .findOne({ _id: new ObjectId(postId) });

      if (post) {
        const result = await db.collection(this.collection).insertOne(comment);

        if (result) {
          const updatedPost = await db.collection("posts").updateOne(
            {
              _id: new ObjectId(postId),
            },
            {
              $push: {
                comments: new ObjectId(result.insertedId),
              },
            }
          );

          if (updatedPost) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async get(postId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      const comments = await collection
        .find({ postId: new ObjectId(postId) })
        .toArray();
      return comments;
    } catch (error) {
      throw error;
    }
  }

  async update(commentId, userId, content) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection.updateOne(
        {
          _id: new ObjectId(commentId),
          userId: new ObjectId(userId),
        },
        {
          $set: { content: content },
        }
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(commentId, userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const comment = await collection.findOne({
        _id: new ObjectId(commentId),
      });

      if (comment) {
        const result = await collection.deleteOne({
          _id: new ObjectId(commentId),
          userId: new ObjectId(userId),
        });

        if (result.deletedCount > 0) {
          await db.collection("posts").updateOne(
            {
              _id: new ObjectId(comment.postId),
            },
            {
              $pull: { comments: new ObjectId(commentId) },
            }
          );

          return true;
        } else {
          const post = await db
            .collection("posts")
            .findOne({ _id: new ObjectId(comment.postId) });

          if (post.userId == userId) {
            const deleted = await collection.deleteOne({
              _id: new ObjectId(commentId),
            });

            if (deleted) {
              await db.collection("posts").updateOne(
                {
                  _id: new ObjectId(comment.postId),
                },
                {
                  $pull: { comments: new ObjectId(commentId) },
                }
              );

              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
