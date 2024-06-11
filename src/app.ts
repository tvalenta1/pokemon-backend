import { MikroORM, RequestContext } from '@mikro-orm/core';
import { fastify } from 'fastify';
import openapiGlue from "fastify-openapi-glue";
import { initORM } from './db.js';
import { User } from './modules/user/user.entity.js';
import { Service } from './serviceHandlers.js';
import { Security } from "./security.js";

export async function bootstrap(port = 3000) {
  const db = await initORM();
  const app = fastify({
    logger: {
      level: 'debug',
      transport: {
        target: 'pino-pretty'
      }
    }
  });

  const oaGlueOptions = {
    specification: `/Users/thonda/programovani/node_projects/pokemons-backend/src/openapi/api-spec.yaml`,
    serviceHandlers: new Service(),
    securityHandlers: new Security(),
  };

  app.register(openapiGlue, oaGlueOptions);

  // register request context hook
  app.addHook('onRequest', (request, reply, done) => {
    RequestContext.create(db.em, done);
  });

  // shut down the connection when closing the app
  app.addHook('onClose', async () => {
    await db.orm.close();
  });

  app.get('/users', async request => {
    const { limit, offset } = request.query as { limit?: number; offset?: number };
    const [items, total] = await db.user.findAndCount({}, { limit, offset });
  
    return { items, total };
  });

  // app.get('/pokemons', async request => {
  //   const { limit, offset } = request.query as { limit?: number; offset?: number };
  //   const [items, total] = await db.pokemon.findAndCount({}, { limit, offset });
  
  //   return { items, total };
  // });

  const url = await app.listen({ port });

  return { app, url };
}
