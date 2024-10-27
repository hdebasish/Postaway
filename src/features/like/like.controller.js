import LikeRepo from "./like.repo.js";
import LikeModel from "./like.model.js";

export default class LikeController {
  constructor() {
    this.likeRepo = new LikeRepo();
  }

  async likePostOrComment(req, res, next) {
    try {
      const userId = req.userId;
      const likeable = req.params.id;
      const type = req.query.type;

      if (userId && likeable && type) {
        if (type != "Post" && type != "Comment") {
          return res.status(400).send("Invalid request");
        }

        if (type == "Post") {
          const post = await this.likeRepo.findPostById(likeable);
          if (!post) {
            return res.status(404).send("Post not found");
          }
        }

        if (type == "Comment") {
          const comment = await this.likeRepo.findCommentById(likeable);
          if (!comment) {
            return res.status(404).send("Comment not found");
          }
        }

        const likeData = new LikeModel(userId, likeable, type);
        const result = await this.likeRepo.like(likeData);
        if (result == "liked") {
          res.status(201).send("Liked");
        } else if (result == "unliked") {
          res.status(200).send("Unliked");
        } else {
          res.status(400).send("Something went wrong");
        }
      } else {
        return res.status(400).send("Missing parameters");
      }
    } catch (error) {
      next(error);
    }
  }

  async getLikes(req, res, next) {
    try {
      const id = req.params.id;

      const result = await this.likeRepo.get(id);

      if (result.length > 0) {
        res.status(200).send(result);
      } else {
        res.status(404).send("Likes Not found");
      }
    } catch (error) {
      next(error);
    }
  }
}
