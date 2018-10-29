'use strict'
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);
const client = redis.createClient()

const savePull = (org, repo, pull) => {
  // key = org:repo:closed/merged
  const hashKey = `pr:${org}:${repo}:${pull.id}`
  const setKey = `pr:time:${org}:${repo}`
  try {
    for (const [key, value] of Object.entries(pull)) {
      if(value) {
        client.hset(hashKey, key, value);
      }
    }
    client.zadd(setKey, pull.createdAt, pull.id)
    const setStateKey = setKey + ':'+pull.state;
    client.zadd(setStateKey, pull.createdAt, pull.id)
    const setUserKey = setKey + ':' + pull.createdById;
    client.zadd(setUserKey, pull.createdAt, pull.id)
    const setUserStateKey = setKey + ':' + pull.state;
    client.zadd(setUserStateKey, pull.createdAt, pull.id)
  } catch (err) {
    console.log(err)
  }
}

const savePulls = (org, repo, pulls) => {
  for(const pull of pulls) {
    savePull(org, repo, pull)
  }
}

module.exports = {
  savePulls
}