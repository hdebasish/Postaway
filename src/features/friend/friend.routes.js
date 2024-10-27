import express from "express";
import FriendController from "./friend.controller.js";

const friendRouter = express.Router();

const friendController = new FriendController();

friendRouter.get("/get-friends/:userId", (req, res, next) => {
  friendController.getFriends(req, res, next);
});

friendRouter.get("/get-pending-requests", (req, res, next) => {
  friendController.getPendingRequests(req, res, next);
});

friendRouter.get("/toggle-friendship/:userId", (req, res, next) => {
  friendController.toggleFriends(req, res, next);
});

friendRouter.get("/response-to-request/:friendId", (req, res, next) => {
  friendController.respondRequest(req, res, next);
});

export default friendRouter;
