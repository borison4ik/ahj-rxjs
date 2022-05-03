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

const messages = [
  {
    id: uuid(),
    from: faker.internet.email(),
    subject: faker.company.companyName(),
    body: faker.lorem.paragraph(),
    received: new Date(faker.date.recent(10)).getTime(),
  },
];

router.get('/', async (ctx, next) => {
  ctx.response.status = 200;
  ctx.response.body = [];
});

router.post('/messages/add', async (ctx, next) => {
  messages.push({
    id: uuid(),
    from: faker.internet.email(),
    subject: faker.company.companyName(),
    body: faker.lorem.paragraph(),
    received: new Date(faker.date.recent(10)).getTime(),
  });
  ctx.response.status = 204;
});

router.get('/messages/unread', async (ctx, next) => {
  ctx.response.status = 200;
  ctx.response.body = JSON.stringify({
    status: 'ok',
    timestamp: 1553400000,
    messages,
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

const server = http.createServer(app.callback()).listen(7070);
