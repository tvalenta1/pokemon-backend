import crypto from 'crypto';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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

    constructor(firstName: string, lastName: string, email: string, password: string) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.password = User.hashPassword(password);
    }

    static isValidPassword(password: string, passwordInDB: string) {
      return User.hashPassword(password) === passwordInDB;
    }

    static hashPassword(password: string) {
      return crypto.createHmac('sha256', password).digest('hex');
    }
}
