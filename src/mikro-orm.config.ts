import { Options, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { SeedManager } from "@mikro-orm/seeder";
import { Migrator } from "@mikro-orm/migrations";
import { AppError } from "./AppError.js";

import type { Dictionary, IPrimaryKey } from "@mikro-orm/core";

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: "postgresql",
  host: "localhost",
  user: "postgres",
  password: "supersecret",
  entities: ["dist/**/*.entity.js"],
  entitiesTs: ["src/**/*.entity.ts"],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  dynamicImportProvider: (id) => import(id),
  extensions: [SeedManager, Migrator],
  findOneOrFailHandler: (
    entityName: string,
    where: Dictionary | IPrimaryKey,
  ) => {
    return new AppError(
      "NotFoundError",
      `${entityName} not found! (${JSON.stringify(where)})`,
      404,
    );
  },
  seeder: {
    path: "src/data/seeders/", // path to the folder with seeders
    pathTs: "src/data/seeders/", // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: "DatabaseSeeder", // default seeder class name
    glob: "!(*.d).{js,ts}", // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: "ts", // seeder generation mode
    fileName: (className: string) => className // seeder file naming convention
  }
};

export default config;
