import ProfileRepo from "./profile.repo.js";

export default class ProfileController {
  constructor() {
    this.profileRepo = new ProfileRepo();
  }

  async getDetails(req, res, next) {
    try {
      const users = await this.profileRepo.getAll();
      if (users.length > 0) {
        return res.status(200).send(users);
      } else {
        return res.status(400).send("Users not found!");
      }
    } catch (error) {
      next(error);
    }
  }

  async getUserDetail(req, res, next) {
    try {
      const id = req.params.userId;

      const user = await this.profileRepo.get(id);

      if (user.length > 0) {
        return res.status(200).send(user[0]);
      } else {
        return res.status(400).send("User not found!");
      }
    } catch (error) {
      next(error);
    }
  }

  async updateUserDetail(req, res, next) {
    try {
      const tokenid = req.userId;

      const id = req.params.userId;

      if (tokenid === id) {
        const { name, email, gender } = req.body;

        const user = await this.profileRepo.update(id, name, email, gender);
        if (user) {
          return res.status(200).send("Updated Successfully");
        } else {
          return res.status(400).send("User not found!");
        }
      } else {
        return res.status(401).send("Access Denied!");
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const userId = req.userId;

      const token = req.headers["authorization"];

      const result = await this.profileRepo.removeToken(userId, token);

      if (result.modifiedCount > 0) {
        return res.status(200).send("Logged out successfully!");
      } else {
        return res.status(400).send("Error logging out.");
      }
    } catch (error) {
      next(error);
    }
  }

  async logoutAll(req, res, next) {
    try {
      const userId = req.userId;

      const result = await this.profileRepo.removeAllToken(userId);

      if (result.modifiedCount > 0) {
        return res
          .status(200)
          .send("Logged out successfully from all devices!");
      } else {
        return res.status(400).send("Error logging out.");
      }
    } catch (error) {
      next(error);
    }
  }
}
