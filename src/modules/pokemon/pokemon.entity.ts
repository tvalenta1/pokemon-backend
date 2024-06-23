import {
  Cascade,
  Collection,
  DoubleType,
  Entity,
  PrimaryKey,
  ManyToMany,
  OneToOne,
  OneToMany,
  Property,
  wrap
} from "@mikro-orm/core";

import { PokemonType } from "./pokemonType.entity.js";
import { Height } from "./height.entity.js";
import { Weight } from "./weight.entity.js";
import { EvolutionRequirement } from "./evolutionrequirement.entity.js";
import { Attack } from "./attack.entity.js";
import { AttackType } from "./attack.entity.js";
import { Move } from "./move.entity.js";

import type { EntityManager } from "@mikro-orm/core";
import type { PokemonEvolution } from "./evolutionsCache.service.js";

@Entity()
export class Pokemon {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  classification!: string;

  @ManyToMany()
  types = new Collection<PokemonType>(this);

  @ManyToMany()
  resistant = new Collection<PokemonType>(this);

  @ManyToMany()
  weaknesses = new Collection<PokemonType>(this);

  @OneToOne({ orphanRemoval: true })
  weight!: Weight;

  @OneToOne({ orphanRemoval: true })
  height!: Height;

  @Property({ type: DoubleType })
  fleeRate!: number;

  @Property()
  maxCP!: number;

  @Property()
  maxHP!: number;

  @OneToOne({ nullable: true, default: null })
  evolutionRequirements?: EvolutionRequirement;

  @OneToOne({ nullable: true, default: null })
  evolvesInto?: Pokemon;

  @OneToMany(() => Attack, (attack) => attack.pokemon, {
    cascade: [Cascade.ALL]
  })
  attacks = new Collection<Attack>(this);

  output(evolutionsCache: Map<number, PokemonEvolution>) {
    return {
      id: this.id,
      name: this.name,
      classification: this.classification,
      types: this.outputTypes(this.types),
      resistant: this.outputTypes(this.resistant),
      weaknesses: this.outputTypes(this.weaknesses),
      weight: this.weight,
      height: this.height,
      fleeRate: this.fleeRate,
      maxCP: this.maxCP,
      maxHP: this.maxHP,
      evolutionRequirements: this.evolutionRequirements,
      evolutions: this.outputEvolutions(evolutionsCache),
      previousEvolutions: this.outputPreviousEvolutions(evolutionsCache),
      attacks: this.outputAttacks(this.attacks)
    };
  }

  outputPokemonLink(pokemon: Pokemon | undefined) {
    if (!pokemon) return null;
    return {
      id: pokemon.id,
      name: pokemon.name
    };
  }

  outputTypes(types: Collection<PokemonType>) {
    return types.map((type) => type.output());
  }

  outputAttacks(attacks: Collection<Attack>) {
    const outputAttacks: any = {};
    for (const attack of attacks) {
      const moves = attack.moves.toArray();
      outputAttacks[attack.type] = moves;
    }
    return outputAttacks;
  }

  outputEvolutions(evolutionsCache: Map<number, PokemonEvolution>) {
    const pokemonEvolutions = [];
    let pokemonId: number | undefined = this.id;
    while (pokemonId != null) {
      const nextEvol = evolutionsCache.get(pokemonId);
      if (nextEvol != null && nextEvol?.evolvesInto != null) {
        pokemonEvolutions.push(nextEvol.evolvesInto);
      }
      pokemonId = nextEvol?.evolvesInto?.id;
    }
    return pokemonEvolutions;
  }

  outputPreviousEvolutions(evolutionsCache: Map<number, PokemonEvolution>) {
    const previousEvolutions = [];
    let pokemonId: number | undefined = this.id;
    while (pokemonId != null) {
      const previousEvol = evolutionsCache.get(pokemonId);
      if (previousEvol != null && previousEvol?.evolvesFrom != null) {
        previousEvolutions.push(previousEvol.evolvesFrom);
      }
      pokemonId = previousEvol?.evolvesFrom?.id;
    }
    return previousEvolutions;
  }

  static createPokemon(inputAttributes: any, entityManager: EntityManager) {
    const pokemon = new Pokemon();
    pokemon.name = inputAttributes.name;
    pokemon.classification = inputAttributes.classification;
    pokemon.fleeRate = inputAttributes.fleeRate;
    pokemon.maxCP = inputAttributes.maxCP;
    pokemon.maxHP = inputAttributes.maxHP;
    Object.keys(inputAttributes.attacks).map((value) => {
      const attack = new Attack();
      attack.pokemon = pokemon;
      attack.type = value as AttackType;
      for (const attackMove of inputAttributes.attacks[value]) {
        const move = new Move();
        move.name = attackMove.name;
        move.type = attackMove.type;
        move.damage = attackMove.damage;
        attack.moves.add(move);
      }
      pokemon.attacks.add(attack);
    });
    wrap(pokemon).assign(
      {
        types: inputAttributes.types,
        weight: inputAttributes.weight,
        height: inputAttributes.height,
        resistant: inputAttributes.resistant,
        weaknesses: inputAttributes.weaknesses,
        evolutionRequirements: inputAttributes.evolutionRequirements
      },
      { em: entityManager }
    );
    return pokemon;
  }

  static async updatePokemon(
    pokemonId: number,
    inputAttributes: any,
    entityManager: EntityManager
  ) {
    const pokemon = await entityManager.findOneOrFail(
      Pokemon,
      { id: pokemonId },
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
    const { attacks, evolvesInto, ...otherUpdatedAttributes } = inputAttributes;
    wrap(pokemon).assign({ ...otherUpdatedAttributes }, { em: entityManager });
    if (evolvesInto) {
      const evolvesIntoPokemon = await entityManager.findOneOrFail(Pokemon, {
        id: evolvesInto?.id
      });
      wrap(pokemon).assign({ evolvesInto: evolvesIntoPokemon });
    }
    if (attacks) {
      pokemon.attacks.removeAll();
      Object.keys(attacks).map((value) => {
        const attack = new Attack();
        attack.pokemon = pokemon;
        attack.type = value as AttackType;
        for (const attackMove of attacks[value]) {
          const move = new Move();
          move.name = attackMove.name;
          move.type = attackMove.type;
          move.damage = attackMove.damage;
          attack.moves.add(move);
        }
        pokemon.attacks.add(attack);
      });
    }
    return pokemon;
  }

  toPokemonLink() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

export type PokemonLink = {
  id: number;
  name: string;
};
