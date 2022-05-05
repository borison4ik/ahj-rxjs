import Router from 'koa-router';
import { v4 as uuid } from 'uuid';
import http from 'http';
import Koa from 'koa';
import koaBody from 'koa-body';
import cors from 'koa-cors';
import { faker } from '@faker-js/faker';

const app = new Koa();
const router = new Router();

app.use(
  cors([
    {
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    },
  ]),
);
app.use(
  koaBody({
    urlencode: true,
    multipart: true,
  }),
);

router.get('/', async (ctx, next) => {
  ctx.response.status = 200;
  ctx.response.body = [];
});

router.get('/messages/unread', async (ctx, next) => {
  ctx.response.status = 200;
  const getMessage = () => {
    return {
      id: uuid(),
      from: faker.internet.email(),
      subject: faker.company.companyName(),
      body: faker.lorem.paragraph(),
      received: new Date(faker.date.recent(10)).getTime(),
    };
  };
  ctx.response.body = JSON.stringify({
    status: 'ok',
    timestamp: 1553400000,
    messages: Array.from({ length: Math.floor(Math.random() * 10 + 1) }).map(getMessage),
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback()).listen(7070);
