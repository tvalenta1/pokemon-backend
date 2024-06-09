import { MikroORM } from '@mikro-orm/core';
import { User } from "./modules/user/user.entity.js";

// initialize the ORM, loading the config file dynamically
const orm = await MikroORM.init();

// recreate the database schema
// await orm.schema.refreshDatabase();

// fork first to have a separate context
const em = orm.em.fork();

// create new user entity instance
const user = new User();
user.email = 'foo@bar.com';
user.fullName = 'Foo Bar';
user.password = '123456';

// first mark the entity with `persist()`, then `flush()`
await em.persist(user).flush();

orm.close();
