import { RequestContext } from "@mikro-orm/core";
import { fastify } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import openapiGlue from "fastify-openapi-glue";
import { initORM } from "./db.js";
import serviceHandlers from "./serviceHandlers.js";
import securityHandler from "./modules/authentication/security.handler.js";
import { EvolutionsCacheService } from "./modules/pokemon/evolutionsCache.service.js";

export async function bootstrap(port = 3000) {
  const db = await initORM();

  // Populate the Pokemon evolutions cache
  EvolutionsCacheService.refreshCache();
  const app = fastify({
    logger: {
      level: "trace",
      transport: {
        target: "pino-pretty"
      }
    },
    ajv: {
      customOptions: {
        strict: false
      }
    }
  });

  const oaGlueOptions = {
    specification: `${process.cwd()}/src/openapi/api-spec.yaml`,
    serviceHandlers: serviceHandlers,
    securityHandlers: securityHandler
  };

  app.register(openapiGlue, oaGlueOptions);

  app.register(swagger, {
    mode: "static",
    specification: {
      path: `${process.cwd()}/src/openapi/api-spec.yaml`, //${process.env.PWD}
      postProcessor: function (swaggerObject) {
        return swaggerObject;
      },
      baseDir: "./specFilesLocation"
    }
  });

  app.register(swaggerUI, {
    routePrefix: "/swagger",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true
  });

  // Register request context hook
  app.addHook("onRequest", (request, reply, done) => {
    RequestContext.create(db.em, done);
  });

  // Shut down the connection when closing the app
  app.addHook("onClose", async () => {
    await db.orm.close();
  });

  const url = await app.listen({ port, host: "0.0.0.0" });

  return { app, url };
}
