import { Entity, PrimaryKey, OneToOne, Property } from '@mikro-orm/core';
import { Session } from '../authentication/session.entity.js';

@Entity()
export class User {
    @PrimaryKey()
    id!: number;

    @Property()
    firstName!: string;

    @Property()
    lastName!: string;

    @Property()
    email!: string;

    @Property()
    password!: string;

    @OneToOne()
    session?: Session;

    @Property()
    createdAt = new Date();
    
    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
