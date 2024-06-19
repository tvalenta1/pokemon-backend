import { initORM } from "../../db.js";

const db = await initORM();

export async function getPokemonTypes(req: any, resp: any) {
  const pokemonTypes = await db.pokemonType.findAll();
  return pokemonTypes.map((type) => type.output());
}
