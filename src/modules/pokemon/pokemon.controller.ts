import { initORM } from "../../db.js";
import { HEADER_TOTAL_COUNT } from "../../constants.js";
import { Pokemon } from "./pokemon.entity.js";
import {
  pokemonsEvolutionsCache,
  EvolutionsCacheService
} from "./evolutionsCache.service.js";

const db = await initORM();

export async function getPokemons(req: any, resp: any) {
  const { limit, offset, name } = req.query as {
    limit?: number;
    offset?: number;
    name?: string;
  };
  const where = name ? { name } : {};
  const [pokemons, total] = await db.pokemon.findAndCount(where, {
    limit,
    offset,
    populate: [
      "weight",
      "height",
      "evolutionRequirements",
      "types",
      "resistant",
      "weaknesses",
      "evolvesInto",
      "attacks",
      "attacks.moves"
    ]
  });
  resp.header(HEADER_TOTAL_COUNT, total);
  return pokemons.map((pokemon) => pokemon.output(pokemonsEvolutionsCache));
}

export async function getPokemon(req: any, resp: any) {
  const pokemon = await db.pokemon.findOneOrFail(
    { id: req.params.pokemonId },
    {
      populate: [
        "weight",
        "height",
        "evolutionRequirements",
        "types",
        "resistant",
        "weaknesses",
        "evolvesInto",
        "attacks",
        "attacks.moves"
      ]
    }
  );
  return pokemon.output(pokemonsEvolutionsCache);
}

export async function createPokemon(req: any, resp: any) {
  const pokemon = Pokemon.createPokemon(req.body, db.em);
  await db.em.persist(pokemon).flush();
  resp.status(201);
  return pokemon.output(pokemonsEvolutionsCache);
}

export async function updatePokemon(req: any, resp: any) {
  const updatedPokemon = await Pokemon.updatePokemon(
    req.params.pokemonId,
    req.body,
    db.em
  );
  await db.em.persist(updatedPokemon).flush();
  // Refresh cache to pick up any new evolutions / previous evolutions.
  EvolutionsCacheService.refreshCache();
  return updatedPokemon.output(pokemonsEvolutionsCache);
}

export async function deletePokemon(req: any, resp: any) {
  const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId });
  await db.em.remove(pokemon).flush();
  resp.status(204);
  return;
}
