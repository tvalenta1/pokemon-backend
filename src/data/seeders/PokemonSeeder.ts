import fs from "fs";
import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Pokemon } from "../../modules/pokemon/pokemon.entity.js";

export class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const pokemons = JSON.parse(
      fs.readFileSync(`${process.cwd()}/src/data/pokemons.json`, "utf8")
    );
    // In the first round, only create the pokemons
    for (const pokemon of pokemons) {
      const newPokemon = Pokemon.createPokemon(pokemon, em);
      await em.persist(newPokemon).flush();
    }
    // In the second round, we will assign the evolvesInto relationships.
    for (const pokemon of pokemons) {
      if (pokemon.evolutions && pokemon.evolutions[0]) {
        const updatedPokemon = await Pokemon.updatePokemon(
          Number(pokemon.id),
          {
            evolvesInto: {
              id: pokemon.evolutions[0].id,
              name: pokemon.evolutions[0].name
            }
          },
          em
        );
        await em.persist(updatedPokemon).flush();
      }
      const newPokemon = Pokemon.createPokemon(pokemon, em);
      await em.persist(newPokemon).flush();
    }
  }
}
