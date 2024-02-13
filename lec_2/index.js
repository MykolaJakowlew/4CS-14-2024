import express from 'express';
import bodyParser from 'body-parser';
import { USERS } from './db.js';
import { OrdersRouter } from './routers/index.js';

const app = express();

app.use(bodyParser.json());

app.use(OrdersRouter);

/**
 * POST -- create resource
 * req -> input data
 * res -> output data
 */
app.post('/users', (req, res) => {
  const { body } = req;

  console.log(`body`, JSON.stringify(body));

  const isUserExist = USERS.some(el => el.login === body.login);
  if (isUserExist) {
    return res.status(400).send({ message: `user with login ${body.login} already exists` });
  }

  USERS.push(body);

  res.status(200).send({ message: 'User was created' });
});

app.get('/users', (req, res) => {
  const users = USERS.map(user => {
    const { password, ...other } = user;
    return other;
  });
  return res
    .status(200)
    .send(users);
});

app.post('/login', (req, res) => {
  const { body } = req;

  const user = USERS
    .find(el => el.login === body.login && el.password === body.password);

  if (!user) {
    return res.status(400).send({ message: 'User was not found' });
  }

  const token = crypto.randomUUID();

  user.token = token;
  USERS.save(user.login, { token });

  return res.status(200).send({
    token,
    message: 'User was login'
  });
});

app.listen(8080, () => console.log('Server was started'));