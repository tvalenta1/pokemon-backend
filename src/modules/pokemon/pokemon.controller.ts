import { initORM } from "../../db.js";
import { HEADER_TOTAL_COUNT } from "../../constants.js";

const db = await initORM();

export async function getPokemons(req, resp) {
  const { limit, offset } = req.query as { limit?: number; offset?: number };
  const [pokemons, total] = await db.pokemon.findAndCount({ }, { limit, offset, populate: ["weight", "height", "evolutionRequirements", "types", "resistant", "weaknesses", "evolutions"] });
  resp.header(HEADER_TOTAL_COUNT, total);
  console.log(pokemons);
  return pokemons;
}

export async function getPokemon(req, resp) {
  // try {
    const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId }, { populate: ["weight", "height", "evolutionRequirements", "types", "resistant", "weaknesses", "evolutions"] });
    console.log(pokemon);
    return pokemon.output();
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

export async function createPokemon(req, resp) {
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
