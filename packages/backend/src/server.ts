import Koa from 'koa';
import Router from '@koa/router';
import Cors from '@koa/cors';
import fatCharacters from './fat-characters';
import { Server } from 'http';

export default async function main(port = 3000): Promise<Server> {
  // Server setup
  const app = new Koa();
  const router = new Router();

  router.get('/fat-characters', await fatCharacters());

  app.use(Cors());
  app.use(router.routes()).use(router.allowedMethods());

  // This is where the magic happens ✨
  console.log(`The server is running at port ${port}`);
  return app.listen(port);
}
