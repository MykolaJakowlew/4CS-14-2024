// const express = require('express');
import express from 'express';
import bodyParser from 'body-parser';
import { USERS, ORDERS } from './db.js';
import { authorizationMiddleware } from './middleware.js';

const app = express();
app.use(bodyParser.json());
/**
 * req - input data
 * res - output data
 */
app.post('/users', (req, res) => {
 const { body } = req;

 console.log('body', body);

 const isUserExists = USERS.some(el => el.login === body.login);
 if (isUserExists) {
  return res.status(400).send({
   message: `User with such login ${body.login} already exists`
  });
 }

 USERS.push(body);

 return res.status(200).send({ message: "User was created" });
});

app.post('/login', (req, res) => {
 const { body } = req;

 const user = USERS.find(el => el.login === body.login && el.password === body.password);

 if (!user) {
  return res.status(400).send({
   message: "user was not found"
  });
 }

 const token = crypto.randomUUID();

 USERS.save(user.login, { token });

 return res.status(200).send({
  message: "user was logged-in",
  token
 });
});

app.get('/users', (req, res) => {
 const { headers } = req;

 const token = headers.authorization;

 if (token != "super_admin_password") {
  return res.status(403).send();
 }

 const users = USERS.data.map((el) => {
  const { password, login, ...other } = el;

  return other;
 });

 return res.status(200).send(users);
});

app.post('/orders', authorizationMiddleware, (req, res) => {

 // const { body, headers } = req;
 // const token = headers.authorization;
 // if (!token) {
 //  return res.status(401).send({
 //   message: "user is not legged-in"
 //  });
 // }
 // const user = USERS.find(el => el.token === token);
 // if (!user) {
 //  return res.status(400).send({
 //   message: 'User with such token was not found '
 //  });
 // }

 const { body, user } = req;

 const order = {
  ...body,
  login: user.login
 };

 ORDERS.push(order);

 return res.status(200).send({ message: "Order was created", order });
});

app.get('/orders', authorizationMiddleware, (req, res) => {
 const { user } = req;

 const orders = ORDERS.filter(el => el.login === user.login);

 return res.status(200).send(orders);
});

app.listen(8080, () => {
 console.log(`Server was started`);
});