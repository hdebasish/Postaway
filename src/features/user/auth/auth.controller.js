import AuthModel from "./auth.model.js";
import AuthRepo from "./auth.repo.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
// import { ApplicationError } from "../../../error-handler/application.error.js";

export default class AuthController {
  constructor() {
    this.authRepo = new AuthRepo();
  }

  async signup(req, res, next) {
    try {
      const { name, email, password, gender } = req.body;

      const userExists = await this.authRepo.findByEmail(email);

      // throw new Error("Unknown Error");

      if (userExists) {
        return res.status(409).send("User already exists.");
        // throw new ApplicationError("Know Errors", 500);
      } else {
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new AuthModel(name, email, hashedPassword, gender);

        const createdUser = await this.authRepo.signup(user);

        if (createdUser) {
          return res.status(201).send(createdUser);
        } else {
          return res.status(400).send("Failed to create user");
        }
      }
    } catch (error) {
      next(error);
    }
  }

  async signin(req, res, next) {
    try {
      const email = req.body.email;
      const user = await this.authRepo.findByEmail(email);

      if (user) {
        const validate = await bcrypt.compare(req.body.password, user.password);
        if (validate) {
          const token = jsonwebtoken.sign(
            { userID: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );

          const result = await this.authRepo.saveToken(user._id, token);

          if (result) {
            return res.status(200).send(token);
          } else {
            res.status(500).send("Server error");
          }
        } else {
          return res.status(401).send("Incorrect Username or Password");
        }
      } else {
        return res.status(404).send("User not found");
      }
    } catch (error) {
      next(error);
    }
  }
}
