import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Pokemon {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  classification!: string;

  // @Property()
  // types!: string;

  // @Property({ type: 'text' })
  // resistant = '';

  // @Property()
  // weaknesses = "";
  
  // @Property()
  // weight: min, max
  
  // @Property()
  // weight: min, max

  @Property()
  fleeRate!: number;

  @Property()
  maxCP!: number;

  @Property()
  maxHP!: number;

  // @Property()
  // evolutionRequirements: {"amount": 25, "name": "Bulbasaur candies" },

  // @Property()
  // evolutions: []

  // @Property()
  // attacks: {fast: [{"name": "Tackle", "type": "Normal","damage": 12}],"special": []
}
