import fs from "fs";
import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Pokemon } from "../../modules/pokemon/pokemon.entity.js";

export class PokemonSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const pokemons = JSON.parse(
      fs.readFileSync(`${process.cwd()}/src/data/pokemons.json`, "utf8")
    );
    for (const pokemon of pokemons) {
      const newPokemon = Pokemon.createPokemon(pokemon, em);
      await em.persist(newPokemon).flush();
    }
  }
}
