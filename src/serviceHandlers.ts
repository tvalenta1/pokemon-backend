import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  getFavoritePokemons,
  setFavoritePokemon,
  removeFavoritePokemon,
} from "./modules/user/user.controller.js";
import { authenticate } from "./modules/authentication/authentication.controller.js";
import { getPokemonTypes } from "./modules/pokemon/pokemonType.controller.js";
import {
  createPokemon,
  getPokemon,
  getPokemons,
} from "./modules/pokemon/pokemon.controller.js";

export default {
  authenticate,
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
  createPokemon,
  getPokemon,
  getPokemons,
  getPokemonTypes,
  getFavoritePokemons,
  setFavoritePokemon,
  removeFavoritePokemon
};
