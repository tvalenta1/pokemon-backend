import { bootstrap } from "../src/app";
import { initORM } from "../src/db";

export async function initTestApp(port: number) {
  const { orm } = await initORM({
    debug: false,
    dbName: ":memory:",
    tsNode: true,
  });

  await orm.schema.createSchema();

  const { app } = await bootstrap(port);

  return app;
}
