import { Collection, Entity, PrimaryKey, ManyToMany, OneToOne, OneToMany, Property } from '@mikro-orm/core';
import { PokemonType } from './pokemonType.entity.js';
import { Height } from './height.entity.js';
import { Weight } from './weight.entity.js';
import { EvolutionRequirement } from './evolutionrequirement.entity.js';
import { Attack } from './attack.entity.js';

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

  @OneToOne()
  evolutionRequirements!: EvolutionRequirement;

  @ManyToMany()
  evolutions = new Collection<Pokemon>(this);

  @OneToMany({ mappedBy: "pokemon" })
  attacks = new Collection<Attack>(this);
}
