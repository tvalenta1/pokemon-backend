import {
  Cascade,
  Entity,
  PrimaryKey,
  ManyToOne,
  Property
} from "@mikro-orm/core";
import { Attack } from "./attack.entity.js";
import { PokemonType } from "./pokemonType.entity.js";

@Entity()
export class Move {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ cascade: [Cascade.ALL] })
  attack!: Attack;

  @Property()
  name!: string;

  @ManyToOne()
  type!: PokemonType;

  @Property()
  damage!: number;
}
