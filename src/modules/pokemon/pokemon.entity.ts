import { Collection, Entity, PrimaryKey, ManyToMany, OneToOne, OneToMany, Property } from '@mikro-orm/core';
import { Element } from './element.entity.js';
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
  types = new Collection<Element>(this);

  @ManyToMany()
  resistant = new Collection<Element>(this);

  @ManyToMany()
  weaknesses = new Collection<Element>(this);
  
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
