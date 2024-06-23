import { FastifyInstance } from "fastify";
import { initTestApp } from "./utils.js";

let app: FastifyInstance;

beforeAll(async () => {
  app = await initTestApp(30001);
});

afterAll(async () => {
  await app.close();
});

test("list all users", async () => {
  const res = await app.inject({
    method: "get",
    url: "/swagger"
  });

  expect(res.statusCode).toBe(200);

});
