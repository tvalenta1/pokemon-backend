import fs from "fs";
import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { PokemonType } from "../../modules/pokemon/pokemonType.entity.js";

export class PokemonTypeSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const pokemonTypes = JSON.parse(
      fs.readFileSync(`${process.cwd()}/src/data/pokemon_types.json`, "utf8")
    );
    for (const pokemonType of pokemonTypes) {
      em.create(PokemonType, { type: pokemonType });
    }
  }
}
