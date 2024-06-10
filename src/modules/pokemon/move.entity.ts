import { Entity, PrimaryKey, ManyToOne, Property } from '@mikro-orm/core';
import { Attack } from './attack.entity.js';

@Entity()
export class Move {
  @PrimaryKey()
  id!: number;

  @ManyToOne()
  attack!: Attack;

  @Property()
  name!: string;

  @Property()
  damage!: number;
}
