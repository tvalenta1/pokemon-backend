import {
  Entity,
  PrimaryKey,
  ManyToOne,
  OneToOne,
  Property
} from "@mikro-orm/core";
import { Attack } from "./attack.entity.js";
import { PokemonType } from "./pokemonType.entity.js";

@Entity()
export class Move {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  attack!: Attack;

  @Property()
  name!: string;

  @ManyToOne()
  type!: PokemonType;

  @Property()
  damage!: number;
}
