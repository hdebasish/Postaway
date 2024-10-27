import CommentModel from "./comment.model.js";
import CommentRepo from "./comment.repo.js";

export default class CommentController {
  constructor() {
    this.commentRepo = new CommentRepo();
  }

  async createComment(req, res, next) {
    try {
      const postId = req.params.postId;
      const userId = req.userId;
      const content = req.body.content;

      if (!content) {
        return res.status(400).send("Content is required");
      }

      const comment = new CommentModel(postId, userId, content);

      const result = await this.commentRepo.add(comment);

      if (result) {
        res.status(201).send("Comment added successfully");
      } else {
        res.status(400).send("Failed to add comment");
      }
    } catch (error) {
      next(error);
    }
  }

  async getComment(req, res, next) {
    try {
      const postId = req.params.postId;

      const comments = await this.commentRepo.get(postId);

      if (comments.length > 0) {
        res.status(200).send(comments);
      } else {
        res.status(404).send("No comments found");
      }
    } catch (error) {
      next(error);
    }
  }

  async updateComment(req, res, next) {
    try {
      const userId = req.userId;

      const { content } = req.body;

      const commentId = req.params.commentId;

      if (!content || !commentId) {
        return res.status(400).send("Missing required fields");
      }

      const result = await this.commentRepo.update(commentId, userId, content);

      if (result.matchedCount > 0) {
        res.status(200).send("Comment updated successfully!");
      } else {
        res.status(404).send("Failed to update comment.");
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const userId = req.userId;

      const commentId = req.params.commentId;

      const result = await this.commentRepo.delete(commentId, userId);

      if (result) {
        res.status(200).send("Comment deleted successfully!");
      } else {
        res.status(404).send("Failed to delete comment.");
      }
    } catch (error) {
      next(error);
    }
  }
}
