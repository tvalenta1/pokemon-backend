import { Collection, Entity, Enum, OneToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Move } from './move.entity.js';
import { Pokemon } from './pokemon.entity.js';


@Entity()
export class Attack {
  @PrimaryKey()
  id!: number;

  // @ManyToOne("Pokemon")
  // pokemon!: Pokemon;

  @Enum(() => AttackType)
  type!: AttackType;
  
  @OneToMany({ mappedBy: "attack" })
  moves = new Collection<Move>(this);
}

export enum AttackType {
  FAST = 'fast',
  SPECIAL = 'special'
}
