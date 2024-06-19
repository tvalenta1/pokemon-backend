import { Collection, wrap } from "@mikro-orm/core";
import { initORM } from "../../db.js";
import { HEADER_TOTAL_COUNT } from "../../constants.js";
import { Attack } from "./attack.entity.js";
import { Move } from "./move.entity.js";
import { Pokemon } from "./pokemon.entity.js";

import type { AttackType } from "./attack.entity.js";

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
      "evolvesFrom",
      "attacks",
      "attacks.moves"
    ]
  });
  resp.header(HEADER_TOTAL_COUNT, total);
  console.log(pokemons);
  return pokemons.map((pokemon) => pokemon.output());
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
        "evolvesFrom",
        "attacks",
        "attacks.moves"
      ]
    }
  );
  return pokemon.output();
}

export async function createPokemon(req: any, resp: any) {
  const {
    name,
    classification,
    types,
    resistant,
    weaknesses,
    weight,
    height,
    fleeRate,
    evolutionRequirements,
    evolvesInto,
    maxCP,
    maxHP,
    attacks
  } = req.body;
  // console.log(req.body);

  const pokemon = new Pokemon();
  pokemon.name = name;
  pokemon.classification = classification;
  pokemon.fleeRate = fleeRate;
  pokemon.maxCP = maxCP;
  pokemon.maxHP = maxHP;
// console.log(attacks)
  //const attacksCollection = new Collection<Attack>(pokemon);
  const attacksArray = [];
  Object.keys(attacks).map((value, index) => {
    const attack = new Attack();
    attack.pokemon = pokemon;
    attack.type = value as AttackType;
    // const moves = new Collection<Move>(attack);
    for (const attackMove of attacks[value]) {
      const move = new Move();
      move.name = attackMove.name;
      move.type = attackMove.type;
      move.damage = attackMove.damage;
      attack.moves.add(move);
    }
    // attack.moves = moves;
    //attacksCollection.add(attack);
    // attacksArray.push(attack);
    console.log(attack);
    pokemon.attacks.add(attack);
  });
  //pokemon.attacks = attacksCollection;
  wrap(pokemon).assign(
    {
      types,
      weight,
      height,
      resistant,
      weaknesses,
      evolutionRequirements,
      //attacks: attacksCollection
    },
    { em: db.em }
  );
  // db.em.persist(attacks);
  await db.em.persist(pokemon).flush();

  //  findOneOrFail({ id: req.params.pokemonId }, { populate: ["weight", "height", "evolutionRequirements", "types", "resistant", "weaknesses", "evolvesInto", "evolvesFrom"] });
  // if (req.params.petId === 0) {
  // 	// missing required data on purpose !
  // 	// this will trigger a server error on serialization
  // 	return { pet: "Doggie the dog" };
  // }
  resp.status(201);
  console.log(pokemon);
  return pokemon.output();
}

export async function updatePokemon(req: any, resp: any) {
  // const {
  //   name,
  //   classification,
  //   types,
  //   resistant,
  //   weaknesses,
  //   weight,
  //   height,
  //   fleeRate,
  //   evolutionRequirements,
  //   evolvesInto,
  //   maxCP,
  //   maxHP,
  //   attacks
  // } = req.body;
  // console.log(req.body);

  // const pokemon = new Pokemon();
  // pokemon.name = name;
  // pokemon.classification = classification;
  // pokemon.fleeRate = fleeRate;
  // pokemon.maxCP = maxCP;
  // pokemon.maxHP = maxHP;

  // wrap(pokemon).assign({ types, weight, height }, { em: db.em });

  // await db.em.persist(pokemon).flush();

  return "pokemon";
}

export async function deletePokemon(req: any, resp: any) {
  const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId });
  console.log(pokemon);
  await db.em.remove(pokemon).flush();
  resp.status(204);
  return;
}
