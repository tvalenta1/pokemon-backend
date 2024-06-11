import jwt from "jsonwebtoken";
import config from "./config.js";
import { AppError } from "./AppError.js";

export class Security {
	async initialize(schemes) {
		// schemes will contain securitySchemes as found in the openapi specification
		console.log("Initialize:", JSON.stringify(schemes));
	}

	// Security scheme: petstore_auth
	// Type: oauth2
	async bearer_auth(req, reply, params) {
    const { authorization } = req.headers;
    const token = authorization.split(" ").pop();
    try{
      const decoded = jwt.verify(token, config.JWT_ENCRYPTION_SECRET);
      req.authenticatedUser = decoded;
		  console.log("petstore_auth: Authenticating request", decoded);
      return decoded;
    } catch (error) {
      //console.error(error);
      throw new AppError("AuthenticationError", error?.message ?? "Unauthenticated", 401);
    }
		// If validation fails: throw new Error('Could not authenticate request')
		// Else, simply return.

		// The request object can also be mutated here (e.g. to set 'req.user')
	}

	// Security scheme: api_key
	// Type: apiKey
	async api_key(req, reply, params) {
		console.log("api_key: Authenticating request");
		// If validation fails: throw new Error('Could not authenticate request')
		// Else, simply return.

		// The request object can also be mutated here (e.g. to set 'req.user')
	}
}
