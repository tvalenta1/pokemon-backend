import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class EvolutionRequirement {
  @PrimaryKey()
  id!: number;

  @Property()
  amount!: number;

  @Property()
  name!: string;
}
