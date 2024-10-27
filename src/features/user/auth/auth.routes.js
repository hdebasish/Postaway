import express from "express";
import AuthController from "./auth.controller.js";
import Validator from "../../../middleware/validator.middleware.js";

const authRouter = express.Router();

const authController = new AuthController();

authRouter.post(
  "/signup",
  Validator.userSignUpRules(),
  Validator.validate,
  (req, res, next) => {
    authController.signup(req, res, next);
  }
);

authRouter.post(
  "/signin",
  Validator.userSignInRules(),
  Validator.validate,
  (req, res, next) => {
    authController.signin(req, res, next);
  }
);

export default authRouter;
