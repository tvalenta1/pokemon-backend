import { wrap } from "@mikro-orm/core";
import { initORM } from "../../db.js";
import { User } from "./user.entity.js";
import { Pokemon } from "../pokemon/pokemon.entity.js";

const db = await initORM();

export async function getUsers(req, resp) {
  const users = await db.user.findAll();
  console.log(users);
  return users;
};

export async function getUser(req, resp) {
  const user = await db.user.findOneOrFail({ id: req.params.userId });
  return user;
};

export async function createUser(req, resp) {
  const { firstName, lastName, email, password} = req.body;
  const user = new User(firstName, lastName, email, password);
  await db.em.persist(user).flush();
  return user;
};

export async function updateUser(req, resp) {
  const user = await db.user.findOneOrFail({ id: req.params.userId });
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = User.hashPassword(req.body.password);
  await db.em.persist(user).flush();
  return user;
};

export async function deleteUser(req, resp) {
  const user = await db.user.findOneOrFail({ id: req.params.userId });
  await db.em.remove(user).flush();
  resp.status(204);
  return;
};

export async function getFavoritePokemons(req, resp) {
  const userId = req.authenticatedUser.id;
  const userWithFavoritePokemons = await db.user.findOneOrFail({ id: userId }, { populate: ["favoritePokemons"] });
  return userWithFavoritePokemons.favoritePokemons.getItems();
};

export async function setFavoritePokemon(req, resp) {
  const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId });
  const user = await db.user.findOneOrFail({ id: req.authenticatedUser.id });
  wrap(user).assign({ favoritePokemons: pokemon});
  await db.em.flush();
  resp.status(204);
  return;
};

export async function removeFavoritePokemon(req, resp) {
  const pokemon = await db.pokemon.findOneOrFail({ id: req.params.pokemonId });
  const userWithFavoritePokemons = await db.user.findOneOrFail({ id: req.authenticatedUser.id }, { populate: ["favoritePokemons"] });
  userWithFavoritePokemons.favoritePokemons.remove(pokemon);
  await db.em.flush();
  resp.status(204);
  return;
};
