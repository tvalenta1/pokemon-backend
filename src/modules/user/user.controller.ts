import { wrap } from "@mikro-orm/core";
import { initORM } from "../../db.js";
import { User } from "./user.entity.js";
import { AppError } from "../../AppError.js";
import { pokemonsEvolutionsCache } from "../pokemon/evolutionsCache.service.js";

const db = await initORM();

export async function getUsers(req: any, resp: any) {
  const users = await db.user.findAll();
  console.log(users);
  return users;
}

export async function getUser(req: any, resp: any) {
  const user = await db.user.findOneOrFail({ id: req.params.userId });
  return user;
}

export async function createUser(req: any, resp: any) {
  const { firstName, lastName, email, password} = req.body;
  const user = new User(firstName, lastName, email, password);
  await db.em.persist(user).flush();
  resp.status(201);
  return user;
}

export async function updateUser(req: any, resp: any) {
  const user = await db.user.findOneOrFail({ id: req.params.userId });
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = User.hashPassword(req.body.password);
  await db.em.persist(user).flush();
  return user;
}

export async function deleteUser(req: any, resp: any) {
  const user = await db.user.findOneOrFail({ id: req.params.userId });
  await db.em.remove(user).flush();
  resp.status(204);
  return;
}

export async function getFavoritePokemons(req: any, resp: any) {
  const userId = req.authenticatedUser.id;
  const userWithFavoritePokemons = await db.user.findOneOrFail(
    { id: userId },
    {
      populate: [
        "favoritePokemons",
        "favoritePokemons.weight",
        "favoritePokemons.height",
        "favoritePokemons.evolutionRequirements",
        "favoritePokemons.types",
        "favoritePokemons.resistant",
        "favoritePokemons.weaknesses",
        "favoritePokemons.evolvesInto",
        "favoritePokemons.isFavoriteFor",
        "favoritePokemons.attacks",
        "favoritePokemons.attacks.moves"
      ]
    }
  );
  return userWithFavoritePokemons.favoritePokemons
    .getItems()
    .map((pokemon) => pokemon.output(pokemonsEvolutionsCache));
}

export async function setFavoritePokemon(req: any, resp: any) {
  const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId });
  const user = await db.user.findOneOrFail(
    { id: req.authenticatedUser.id },
    { populate: ["favoritePokemons"] }
  );
  if (user.favoritePokemons.contains(pokemon))
    throw new AppError(
      "SetFavoritePokemonError",
      "User already has this Pokemon as favorite",
      400
    );
  wrap(user).assign({ favoritePokemons: pokemon });
  await db.em.flush();
  resp.status(204);
  return;
}

export async function removeFavoritePokemon(req: any, resp: any) {
  const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId });
  const userWithFavoritePokemons = await db.user.findOneOrFail({ id: req.authenticatedUser.id }, { populate: ["favoritePokemons"] });
  userWithFavoritePokemons.favoritePokemons.remove(pokemon);
  await db.em.flush();
  resp.status(204);
  return;
}
