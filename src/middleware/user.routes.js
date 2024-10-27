import express from "express";
import authRouter from "../features/user/auth/auth.routes.js";
import profileRouter from "../features/user/profile/profile.routes.js";
import jwtAuth from "./jwt.middleware.js";

const userRouter = express.Router();

userRouter.use(authRouter);

userRouter.use(jwtAuth, profileRouter);

export default userRouter;
