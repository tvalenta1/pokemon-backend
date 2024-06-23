import {
  EntityManager,
  EntityRepository,
  MikroORM,
  Options
} from "@mikro-orm/postgresql";
import { User } from "./modules/user/user.entity.js";
import { Pokemon } from "./modules/pokemon/pokemon.entity.js";
import { PokemonType } from "./modules/pokemon/pokemonType.entity.js";

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  pokemon: EntityRepository<Pokemon>;
  user: EntityRepository<User>;
  pokemonType: EntityRepository<PokemonType>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  return (cache = {
    orm,
    em: orm.em,
    pokemon: orm.em.getRepository(Pokemon),
    user: orm.em.getRepository(User),
    pokemonType: orm.em.getRepository(PokemonType)
  });
}
