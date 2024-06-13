import { initORM } from "../../db.js";
import { User } from "./user.entity.js";

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
  return user;
};
