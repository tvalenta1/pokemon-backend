import { initORM } from "../../db.js";
import { Pokemon } from "./pokemon.entity.js";

import type { PokemonLink } from "./pokemon.entity.js";

const db = await initORM();
const em = db.orm.em.fork();

export const pokemonsEvolutionsCache = new Map<number, PokemonEvolution>();

export const EvolutionsCacheService = {
  refreshCache: async function () {
    const pokemons = await em.findAll(Pokemon, {
      populate: ["evolvesInto"]
    });
    // For each pokemon we will store their next evolution and previous evolution relations.
    for (const pokemon of pokemons) {
      if (pokemon.evolvesInto) {
        // Set Next Evolution
        const nextEvol =
          pokemonsEvolutionsCache.get(pokemon.id) ?? ({} as PokemonEvolution);
        nextEvol.evolvesInto = pokemon.evolvesInto.toPokemonLink();
        pokemonsEvolutionsCache.set(pokemon.id, nextEvol);

        // Set previous Evolution
        const previousEvol =
          pokemonsEvolutionsCache.get(pokemon.evolvesInto.id) ??
          ({} as PokemonEvolution);
        previousEvol.evolvesFrom = pokemon.toPokemonLink();
        pokemonsEvolutionsCache.set(pokemon.evolvesInto.id, previousEvol);
      }
    }
  }
};

export type PokemonEvolution = {
  evolvesInto: PokemonLink;
  evolvesFrom: PokemonLink;
};
