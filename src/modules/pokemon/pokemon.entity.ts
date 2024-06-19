import {
  Collection,
  DoubleType,
  Entity,
  PrimaryKey,
  ManyToMany,
  OneToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { PokemonType } from "./pokemonType.entity.js";
import { Height } from "./height.entity.js";
import { Weight } from "./weight.entity.js";
import { EvolutionRequirement } from "./evolutionrequirement.entity.js";
import { Attack } from "./attack.entity.js";
import { User } from "../user/user.entity.js";

@Entity()
export class Pokemon {
  // constructor(id: number, name: string, classification: string, ) {

  // }
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

  @OneToOne({ nullable: true, default: null })
  evolvesFrom?: Pokemon;

  @OneToMany(() => Attack, (attack) => attack.pokemon) //{ entity: () => Attack, mappedBy: "pokemon" })
  attacks = new Collection<Attack>(this);

  output() {
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
      evolutions: this.evolvesInto,
      attacks: this.outputAttacks(this.attacks)
    };
  }

  outputTypes(types: Collection<PokemonType>) {
    return types.map((type) => type.output());
  }

  outputAttacks(attacks: Collection<Attack>) {
    const outputAttacks = {};
    for (const attack of attacks) {
      const moves = attack.moves.toArray();
      outputAttacks[attack.type] = moves;
    }
    return outputAttacks;
  }
}
