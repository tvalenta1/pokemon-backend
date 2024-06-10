import { Entity, Property } from '@mikro-orm/core';
import { BodyCharacteristic } from './bodycharacteristic.entity.js';

@Entity()
export class Weight extends BodyCharacteristic {
}
