import PostRepo from "./post.repo.js";
import PostModel from "./post.model.js";

import { ObjectId } from "mongodb";
export default class PostController {
  constructor() {
    this.postRepo = new PostRepo();
  }

  async createPost(req, res, next) {
    try {
      const userId = req.userId;

      const { caption } = req.body;

      if (!caption) {
        return res.status(400).send("Caption is required");
      }

      let imageUrl;

      if (req.file) {
        imageUrl = "/uploads/" + req.file.filename;
      } else {
        return res.status(400).send("Image is required");
      }

      const post = new PostModel(new ObjectId(userId), caption, imageUrl);

      const createdPost = await this.postRepo.addPost(post);

      if (createdPost) {
        return res.status(201).send(createdPost);
      } else {
        return res.status(400).send("Failed to add the post");
      }
    } catch (error) {
      next(error);
    }
  }

  async getAllPosts(req, res, next) {
    try {
      const posts = await this.postRepo.getAllPosts();

      if (posts) {
        return res.status(200).send(posts);
      } else {
        return res.status(404).send("No posts found");
      }
    } catch (error) {
      next(error);
    }
  }

  async getUserPosts(req, res, next) {
    try {
      const id = req.userId;

      const posts = await this.postRepo.getPostByUser(id);

      if (posts) {
        return res.status(200).send(posts);
      } else {
        return res.status(404).send("No posts found");
      }
    } catch (error) {
      next(error);
    }
  }

  async getPost(req, res, next) {
    try {
      const postId = req.params.postId;

      const post = await this.postRepo.getPostById(postId);

      if (post) {
        return res.status(200).send(post);
      } else {
        return res.status(404).send("Post not found!");
      }
    } catch (error) {
      next(error);
    }
  }

  async updatePost(req, res, next) {
    try {
      const postId = req.params.postId;

      const userId = req.userId;

      const { caption } = req.body;

      let imageUrl;

      if (req.file) {
        imageUrl = "/uploads/" + req.file.filename;
      }

      const updatedPost = await this.postRepo.updatePostById(
        postId,
        userId,
        caption,
        imageUrl
      );

      if (updatedPost.matchedCount > 0) {
        return res.status(200).send("Updated Successfully");
      } else {
        return res.status(401).send("Access Denied!");
      }
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req, res, next) {
    try {
      const postId = req.params.postId;

      const userId = req.userId;

      const deletedPost = await this.postRepo.deletePostById(postId, userId);

      if (deletedPost.deletedCount > 0) {
        return res.status(200).send("Deleted Successfully");
      } else {
        return res.status(401).send("Access Denied!");
      }
    } catch (error) {
      next(error);
    }
  }
}
