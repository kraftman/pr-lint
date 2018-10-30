'use strict';
const loader = require('../bl/parse.js');
const querier = require('../bl/query.js');

const loadRepo = async (req) => {
  const {org, repo, domain, token} = req.query;
  await loader.loadRepo(domain, org, repo, token)
  return ('done!')
}

const loadStats = async (req) => {
  const {org, repo} = req.query;
  const endAt = Math.floor((new Date()).getTime()/1000)
  const query = {
    org,
    repo,
    endAt: endAt,
    startAt: endAt - 604800*6, //all for now
    interval: 'days',
  }
  const stats = await querier.getStats(query)
  return (stats.total.creatorStats)
}

const homeRouter = async (fastify) => {
  fastify.get('/repo/load', loadRepo)
  fastify.get('/repo/stats', loadStats)
}

module.exports = homeRouter