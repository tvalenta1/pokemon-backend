import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class BodyCharacteristic {
  @PrimaryKey()
  id!: number;

  @Property()
  minimum!: string;

  @Property()
  maximum!: string;
}
