import { PrimaryKey, Property } from '@mikro-orm/core';

export class BodyCharacteristic {
  @PrimaryKey()
  id!: number;

  @Property()
  minimum!: string;

  @Property()
  maximum!: string;
}
