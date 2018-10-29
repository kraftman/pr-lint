'use strict'
const chai = require('chai');
chai.should();

const { fastify } = require('../../src/fastify/index.js');

describe('e2e tests for fastify server', () => {
  it('should return the name', async () => {
    const name = 'chris'
    const result = await fastify.inject({
      method: 'GET',
      url: '/?name=' + name,
    })
    result.body.should.contain(name)
  })
})