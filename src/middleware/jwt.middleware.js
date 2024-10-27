import jsonwebtoken from "jsonwebtoken";
import { getDB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

const jwtAuth = async (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    try {
      const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      if (payload) {
        const db = getDB();

        const collection = db.collection("users");

        const user = await collection.findOne({ tokens: { $in: [token] } });

        if (user) {
          req.userId = payload.userID;
          next();
        } else {
          return res.status(401).send("Unauthorized");
        }
      }
    } catch (error) {
      const db = getDB();

      const collection = db.collection("users");

      const user = await collection.findOne({ tokens: token });

      if (user) {
        await collection.updateOne(
          { _id: new ObjectId(user._id) },
          { $pull: { tokens: token } }
        );
      }

      return res.status(401).send("Unauthorized");
    }
  } else {
    return res.status(401).send("Unauthorized");
  }
};

export default jwtAuth;
