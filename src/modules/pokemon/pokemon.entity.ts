import { Collection, Entity, PrimaryKey, ManyToMany, OneToOne, OneToMany, Property } from '@mikro-orm/core';
import { PokemonType } from './pokemonType.entity.js';
import { Height } from './height.entity.js';
import { Weight } from './weight.entity.js';
import { EvolutionRequirement } from './evolutionrequirement.entity.js';
import { Attack } from './attack.entity.js';
import { User } from "../user/user.entity.js"

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
  
  @OneToOne()
  weight!: Weight;

  @OneToOne()
  height!: Height;

  @Property()
  fleeRate!: number;

  @Property()
  maxCP!: number;

  @Property()
  maxHP!: number;

  @OneToOne({ nullable: true, default: null })
  evolutionRequirements?: EvolutionRequirement | null;

  @OneToOne({ nullable: true, default: null })
  evolutions? = new Collection<Pokemon>(this);

  // @OneToOne()
  // attacks?: Attack;

  @ManyToMany()
  favoriteForUsers = new Collection<User>(this);

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
      evolutions: this.evolutions?.toArray(),
      //attacks: this.attacks
    };
  }

  outputTypes(types: Collection<PokemonType>) {
    return types.toArray().map(o => o.type);
  }
  
}
