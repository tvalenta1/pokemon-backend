import { bootstrap } from "../src/app";
import { initORM } from "../src/db";

export async function initTestApp(port: number) {

  const { orm } = await initORM({
    debug: false,
  
    dbName: ":memory:",
    // this will ensure the ORM discovers TS entities, with ts-node, ts-jest and vitest
    // it will be inferred automatically, but we are using vitest here
    // tsNode: true,
  });

  // create the schema so we can use the database
  await orm.schema.createSchema();

  const { app } = await bootstrap(port);

  return app;
}
