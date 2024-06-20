import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { PokemonTypeSeeder } from "./PokemonTypeSeeder.js";
import { PokemonSeeder } from "./PokemonSeeder.js";
import { UserSeeder } from "./UserSeeder.js";

export class DatabaseSeeder extends Seeder {
  run(em: EntityManager): Promise<void> {
    return this.call(em, [PokemonTypeSeeder, UserSeeder, PokemonSeeder]);
  }
}
