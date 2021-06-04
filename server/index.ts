import Koa from 'koa';
import next from 'next';
import http from 'http';
import useXTerm from './useXTerm';

const port = 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const koa = new Koa();
  const server = http.createServer(koa.callback());

  useXTerm(server);

  koa.use(async ctx => {
    ctx.respond = false;

    await handle(ctx.req, ctx.res);
  });

  koa.on('error', error => {
    console.error(error);
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
