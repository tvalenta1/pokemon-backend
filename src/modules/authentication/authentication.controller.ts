import jwt from "jsonwebtoken";
import config from "../../config.js";
import { initORM } from "../../db.js";
import { User } from "../user/user.entity.js";
import { AppError } from "../../AppError.js";

const db = await initORM();

export async function authenticate(req, resp) {
  const { email, password } = req.body;
  
  const user = await db.user.findOne({ email });

  if (user == null || !User.isValidPassword(password, user.password))
    throw new AppError("AuthenticationError", "Wrong email or password", 401);

  return {
    token: jwt.sign(user.toJSON(), config.JWT_ENCRYPTION_SECRET, { expiresIn: config.JWT_EXPIRY })
  };

}
