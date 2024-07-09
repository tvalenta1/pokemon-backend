import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export class PokemonType {
  @PrimaryKey()
  type!: string;

  output() {
    return this.type;
  }
}
