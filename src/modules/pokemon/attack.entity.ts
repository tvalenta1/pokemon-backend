import { Collection, Entity, OneToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Move } from './move.entity.js';
import { Pokemon } from './pokemon.entity.js';


@Entity()
export class Attack {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  pokemon!: Pokemon;

  @Property()
  type!: "fast" | "special";

  @OneToMany({ mappedBy: "attack" })
  moves = new Collection<Move>(this);
}
