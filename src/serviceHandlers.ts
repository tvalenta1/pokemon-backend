import jwt from "jsonwebtoken";
import { initORM } from "./db.js";
import config from "./config.js";
import { AppError } from "./AppError.js";

const db = await initORM();

export class Service {
	async getPokemons(req, resp) {
		// console.log("getPokemons", req.params.petId);
		if (req.params.petId === 0) {
			// missing required data on purpose !
			// this will trigger a server error on serialization
			return { pet: "Doggie the dog" };
		}
		return {
			id: req.params.petId,
			name: "Kitty the cat",
			photoUrls: [
				"https://en.wikipedia.org/wiki/Cat#/media/File:Kittyply_edit1.jpg",
			],
			status: "available",
		};
	}

  async getPokemon(req, resp) {
		if (req.params.petId === 0) {
			// missing required data on purpose !
			// this will trigger a server error on serialization
			return { pet: "Doggie the dog" };
		}
		return {
			id: req.params.petId,
			name: "aaaaat",
			photoUrls: [
				"https://en.wikipedia.org/wiki/Cat#/media/File:Kittyply_edit1.jpg",
			],
			status: "available",
		};
	}

  async authenticate(req, resp) {
    const { email, password } = req.body;
    
    const user = await db.user.findOne({ email, password });

    if (user == null)
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
}

interface IAuthToken {
  // jwt.sign({ foo: 'bar' }, 'shhhhh');
}
