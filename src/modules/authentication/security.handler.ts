import jwt from "jsonwebtoken";
import config from "../../config.js";
import { AppError } from "../../AppError.js";

const securityHandler = {
  bearer_auth: async function (req: any, reply: any, params: any) {
    const { authorization } = req.headers;

    if (authorization == null)
      throw new AppError("AuthenticationError", "Missing bearer token", 401);

    const token = authorization.split(" ").pop();
    try {
      const decoded = jwt.verify(token, config.JWT_ENCRYPTION_SECRET);
      req.authenticatedUser = decoded;
      return decoded;
    } catch (error) {
      throw new AppError(
        "AuthenticationError",
        error instanceof Error ? error.message : "Unauthenticated",
        401
      );
    }
  }
};

export default securityHandler;
