import { createUser, getUser, getUsers, updateUser } from "./modules/user/user.controller.js";
import { authenticate } from "./modules/authentication/authentication.controller.js";

export default {
  authenticate,
  createUser,
  getUser,
  getUsers,
  updateUser,

};
