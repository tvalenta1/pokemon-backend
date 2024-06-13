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

  const token = {
    user_id: user.id,
    user_first_name: user.firstName,
    user_last_name: user.lastName,
    user_email: user.email
  }
  return {
    token: jwt.sign(token, config.JWT_ENCRYPTION_SECRET, { expiresIn: config.JWT_EXPIRY }) // expires in 1 hour
  };

}
