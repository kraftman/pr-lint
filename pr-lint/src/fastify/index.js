'use strict';

const fastify = require('fastify')({
  logger: true,
});
const home = require('./routes/home.js');

fastify.register(home)

const start = async () => {
  try {
    await fastify.listen(8080,'0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

if (require.main === module) {
  start();
}

module.exports = { start, fastify }