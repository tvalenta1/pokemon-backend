import crypto from "crypto";
import {
  Collection,
  Entity,
  PrimaryKey,
  ManyToMany,
  Property
} from "@mikro-orm/core";
import { Pokemon } from "../pokemon/pokemon.entity.js";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  firstName!: string;

  @Property()
  lastName!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  password!: string;

  @ManyToMany({ lazy: true })
  favoritePokemons = new Collection<Pokemon>(this);

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = User.hashPassword(password);
  }

  outputForToken() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email
    };
  }

  static isValidPassword(password: string, passwordInDB: string) {
    return User.hashPassword(password) === passwordInDB;
  }

  static hashPassword(password: string) {
    return crypto.createHmac("sha256", password).digest("hex");
  }
}
