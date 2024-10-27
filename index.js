import "./env.js";
import express from "express";
import bodyParser from "body-parser";
import userRouter from "./src/middleware/user.routes.js";
import postRouter from "./src/features/post/post.routes.js";
import { mongodbConnection } from "./src/config/mongodb.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import commentRouter from "./src/features/comment/comment.routes.js";
import likeRouter from "./src/features/like/like.routes.js";
import friendRouter from "./src/features/friend/friend.routes.js";
import otpRouter from "./src/features/otp/otp.routes.js";

const app = express();

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Auth routes and profile routes
app.use("/api/users", userRouter);

// Post routes
app.use("/api/posts", jwtAuth, postRouter);

// Comment routes
app.use("/api/comments", jwtAuth, commentRouter);

// Like routes
app.use("/api/likes", jwtAuth, likeRouter);

// Friend routes
app.use("/api/friends", jwtAuth, friendRouter);

// OTP routes
app.use("/api/otp", otpRouter);

// Error Handler
app.use((err, req, res, next) => {
  console.log(err);

  if (err) {
    res.status(500).send("Fatal error, Please try later");
  }
});

// 404 Error
app.use((req, res) => {
  res.status(404).send("404 Not Found!");
});

// Server is listening
app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on port: http://localhost:${process.env.PORT}`
  );
  mongodbConnection();
});
