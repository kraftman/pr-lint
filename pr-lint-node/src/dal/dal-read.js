'use strict';

const redis = require('async-redis');
const client = redis.createClient()


const getPRStats = async (org, repo, startAt, endAt) => {
  const key = `pr:time:${org}:${repo}`
  const results = await client.zrangebyscore(key, startAt, endAt)
  console.log(results)
  return results
}

const getPRs = async (pullIds) => {
  const prs = []
  for (const prID of pullIds) {
    const res = await client.hgetall(prID)
    console.log(prID)
    prs.push(res)
  }
  return prs
}

const getUsers = async (userIds) => {
  const users = []
  for (const userID of userIds) {
    const res = await client.hgetall(userID)
    users.push(res)
  }
  return users
}

module.exports = {
  getPRStats, 
  getPRs,
  getUsers,
}

