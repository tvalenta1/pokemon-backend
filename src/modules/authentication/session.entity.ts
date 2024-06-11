import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Session {
    @PrimaryKey()
    id!: string;

    @Property({ onUpdate: () => new Date() })
    expiresAt = new Date();
}
