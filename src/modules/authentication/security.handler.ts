import jwt from "jsonwebtoken";
import config from "../../config.js";
import { AppError } from "../../AppError.js";

const securityHandler = {
	// async initialize(schemes) {
	// 	// schemes will contain securitySchemes as found in the openapi specification
	// 	console.log("Initialize:", JSON.stringify(schemes));
	// }

	// Security scheme: bearer_auth
	// Type: bearer token
	bearer_auth: async function(req, reply, params) {
    const { authorization } = req.headers;
    
    if (authorization == null)
      throw new AppError("AuthenticationError", "Missing bearer token", 401);
  
    const token = authorization.split(" ").pop();
    try {
      const decoded = jwt.verify(token, config.JWT_ENCRYPTION_SECRET);
      req.authenticatedUser = decoded;
      return decoded;
    } catch (error) {
      throw new AppError("AuthenticationError", error?.message ?? "Unauthenticated", 401);
    }
	}
}

export default securityHandler;
