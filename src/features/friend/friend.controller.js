import { FriendModel } from "./friend.model.js";

import FriendRepo from "./friend.repo.js";

export default class FriendController {
  constructor() {
    this.friendRepo = new FriendRepo();
  }

  async getFriends(req, res, next) {
    try {
      const userId = req.params.userId;

      if (!userId) {
        return res.status(400).json("User ID is required");
      }

      const friends = await this.friendRepo.findFriendsByUserId(userId);

      if (friends.length > 0) {
        res.status(200).send(friends);
      } else {
        res.status(404).send("No friend found");
      }
    } catch (error) {
      next(error);
    }
  }

  async toggleFriends(req, res, next) {
    try {
      const from_user = req.userId;
      const to_user = req.params.userId;

      if (!to_user) {
        return res.status(400).send("User not found");
      }

      if (from_user == to_user) {
        return res.status(400).send("You cannot be friends with yourself!");
      }

      const user = await this.friendRepo.findUserById(to_user);

      if (!user) {
        return res.status(400).send("User Does Not Exists");
      }

      let friend = await this.friendRepo.findFriend(to_user, from_user);

      if (!friend) {
        friend = await this.friendRepo.findFriend(from_user, to_user);
      }

      if (friend) {
        if (friend.isFriend) {
          const removedFriend = await this.friendRepo.deletedRequest(friend);

          if (removedFriend.modifiedCount > 0) {
            return res.status(200).send("Successfully Removed From friend");
          } else {
            return res.status(500).send("Server error");
          }
        } else {
          return res
            .status(400)
            .send("Please wait for the friend request to be accepted!");
        }
      } else {
        const friendRequest = new FriendModel(from_user, to_user, false);

        const result = await this.friendRepo.add(friendRequest);

        if (result) {
          return res.status(201).send("Sent Friend Request Successfully");
        } else {
          return res.status(400).send("Failed To Send Friend Request");
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async getPendingRequests(req, res, next) {
    try {
      const userId = req.userId;

      const result = await this.friendRepo.getPending(userId);

      if (result.length > 0) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send("No Pending Request Found!");
      }
    } catch (error) {
      next(error);
    }
  }

  async respondRequest(req, res, next) {
    try {
      const userId = req.userId;
      const friendId = req.params.friendId;
      const accept = req.query.accept;

      if (!friendId || !accept) {
        return res.status(400).send("Missing parameters");
      }

      if (accept.toLowerCase() == "true") {
        const result = await this.friendRepo.acceptRequest(userId, friendId);
        if (result) {
          return res.status(200).send("Request accepted");
        } else {
          return res.status(500).send("Error accepting request");
        }
      } else if (accept.toLowerCase() == "false") {
        const result = await this.friendRepo.rejectedRequest(userId, friendId);
        if (result.deletedCount > 0) {
          return res.status(200).send("Request rejected");
        } else {
          return res.status(500).send("Error rejecting request");
        }
      } else {
        return res.status(400).send("Invalid value for accept parameter");
      }
    } catch (error) {
      next(error);
    }
  }
}
