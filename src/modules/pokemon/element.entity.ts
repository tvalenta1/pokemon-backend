import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Element {
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;
}
