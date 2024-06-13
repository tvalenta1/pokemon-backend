import { initORM } from "./db.js";


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
			// id: 1,
			// name: "Kitty the cat",
			
		};
	}

  async getPokemon(req, resp) {
    // try {
      const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId }, { populate: ["weight", "height", "evolutionRequirements", "types", "resistant", "weaknesses", "evolutions"] });
      console.log(pokemon);
      return pokemon;
    // } catch (error) {
      // if (error.name === "NotFoundError") error.statusCode = 404;
      // throw error;
    // }
		// if (req.params.petId === 0) {
		// 	// missing required data on purpose !
		// 	// this will trigger a server error on serialization
		// 	return { pet: "Doggie the dog" };
		// }
		// return {
		// 	id: req.params.petId,
		// 	name: "aaaaat",
		// 	photoUrls: [
		// 		"https://en.wikipedia.org/wiki/Cat#/media/File:Kittyply_edit1.jpg",
		// 	],
		// 	status: "available",
		// };
	}

  async createPokemon(req, resp) {
    console.log(req.body);
		// if (req.params.petId === 0) {
		// 	// missing required data on purpose !
		// 	// this will trigger a server error on serialization
		// 	return { pet: "Doggie the dog" };
		// }
		return {
      id: req.body.id,
      name: req.body.name
    };
	}
}

interface IAuthToken {
  // jwt.sign({ foo: 'bar' }, 'shhhhh');
}
