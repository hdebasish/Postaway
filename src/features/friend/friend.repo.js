import { getDB } from "../../config/mongodb.js";
import { ObjectId } from "mongodb";
export default class FriendRepo {
  constructor() {
    this.collection = "friends";
  }

  async findFriendsByUserId(id) {
    try {
      const db = getDB();
      const collection = db.collection("users");

      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        { $unwind: "$friends" },
        {
          $lookup: {
            from: "users",
            localField: "friends",
            foreignField: "_id",
            as: "friend_info",
          },
        },
        { $unwind: "$friend_info" },
        {
          $project: {
            userId: "$friend_info._id",
            name: "$friend_info.name",
          },
        },
      ];

      return await collection.aggregate(pipeline).toArray();
    } catch (error) {
      throw error;
    }
  }

  async add(friendRequest) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);
      return await collection.insertOne(friendRequest);
    } catch (error) {
      throw error;
    }
  }

  async getPending(userId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const pipeline = [
        {
          $match: {
            to_user: new ObjectId(userId),
            isFriend: false,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "from_user",
            foreignField: "_id",
            as: "user_info",
          },
        },
        { $unwind: "$user_info" },
        {
          $project: {
            userId: "$user_info._id",
            name: "$user_info.name",
          },
        },
      ];

      return await collection.aggregate(pipeline).toArray();
    } catch (error) {
      throw error;
    }
  }

  async acceptRequest(userId, friendId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const findFriendRequest = await collection.findOne({
        _id: new ObjectId(friendId),
        isFriend: false,
      });

      if (findFriendRequest) {
        if (userId != findFriendRequest.to_user) {
          return;
        }

        const acceptedRequest = await collection.updateOne(
          {
            _id: new ObjectId(friendId),
            to_user: new ObjectId(findFriendRequest.to_user),
          },
          { $set: { isFriend: true } }
        );

        if (acceptedRequest.modifiedCount > 0) {
          await db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(findFriendRequest.from_user) },
              { $push: { friends: new ObjectId(findFriendRequest.to_user) } }
            );

          return await db
            .collection("users")
            .updateOne(
              { _id: new ObjectId(findFriendRequest.to_user) },
              { $push: { friends: new ObjectId(findFriendRequest.from_user) } }
            );
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async rejectedRequest(userId, friendId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection.deleteOne({
        _id: new ObjectId(friendId),
        to_user: new ObjectId(userId),
      });
    } catch (error) {
      throw error;
    }
  }

  async findFriend(from_user, to_user) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const result = await collection.findOne({
        from_user: new ObjectId(from_user),
        to_user: new ObjectId(to_user),
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async deletedRequest(friend) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      const result = await collection.deleteOne({ _id: friend._id });

      if (result.deletedCount > 0) {
        await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(friend.from_user) },
            { $pull: { friends: new ObjectId(friend.to_user) } }
          );

        return await db
          .collection("users")
          .updateOne(
            { _id: new ObjectId(friend.to_user) },
            { $pull: { friends: new ObjectId(friend.from_user) } }
          );
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  }

  async cancelRequest(friendId) {
    try {
      const db = getDB();
      const collection = db.collection(this.collection);

      return await collection.deleteOne({ _id: new ObjectId(friendId) });
    } catch (error) {
      throw error;
    }
  }

  async findUserById(id) {
    try {
      const db = getDB();
      const collection = db.collection("users");

      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw error;
    }
  }
}
