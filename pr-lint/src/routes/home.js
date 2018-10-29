'use strict';

const homeHandler = require('../../bl/home-handler.js');

const opts = {
  schema: {
    querystring: {
      name: {type: 'string'}
    }
  }
}

const homeEndpoint = async (req) => {
  return homeHandler(req.query.name)
}

const homeRouter = async (fastify) => {
  fastify.get('/', opts, homeEndpoint)
}

module.exports = homeRouter