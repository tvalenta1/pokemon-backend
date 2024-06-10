import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/sqlite';
import { User } from "./modules/user/user.entity.js";
import { Pokemon } from './modules/pokemon/pokemon.entity.js';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  pokemon: EntityRepository<Pokemon>;
  user: EntityRepository<User>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  // save to cache before returning
  return cache = {
    orm,
    em: orm.em,
    pokemon: orm.em.getRepository(Pokemon),
    user: orm.em.getRepository(User)
  };
}
