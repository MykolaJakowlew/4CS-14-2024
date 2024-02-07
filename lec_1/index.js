const express = require('express');

const app = express();

/**
 * GET    -- read data
 * POST   -- create data
 * DELETE -- delete data
 * PATCH  -- partial update data 
 * PUT    -- full update data
 */

app.get('/', (req, res) => {
 res
  .status(300)
  .send({ message: "Hello world 1" })
  .status(200)
  .send({ message: "Hello world 2" });
});

app.listen(8000, () => {
 console.log('Server was started');
});