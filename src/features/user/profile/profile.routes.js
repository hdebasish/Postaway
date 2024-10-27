import express from "express";
import ProfileController from "./profile.controller.js";

const profileRouter = express.Router();

const profileController = new ProfileController();

profileRouter.get("/get-all-details", (req, res, next) => {
  profileController.getDetails(req, res, next);
});

profileRouter.get("/get-details/:userId", (req, res, next) => {
  profileController.getUserDetail(req, res, next);
});

profileRouter.put("/update-details/:userId", (req, res, next) => {
  profileController.updateUserDetail(req, res, next);
});

profileRouter.get("/logout", (req, res, next) => {
  profileController.logout(req, res, next);
});

profileRouter.get("/logout-all-devices", (req, res, next) => {
  profileController.logoutAll(req, res, next);
});

export default profileRouter;
