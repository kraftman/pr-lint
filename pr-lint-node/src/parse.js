'use strict';

const axios = require('axios')
const dal = require('./dal/pulldal.js');

const getPRs = async (baseURI) => {
  const pullURI = baseURI+'/pulls?state=all&per_page=2'
  try {
    const result = await axios.get(pullURI);
    console.log(JSON.stringify(result.data))
    return result.data
  } catch (err) {
    console.log('err getting from axios: ', err)
  }
};

const toDate = (item) => {
  return item && new Date(item).getTime()/1000;
}

const parsePull = (pull) => {

  const createdAt = toDate(pull.created_at);
  const closedAt = toDate(pull.closed_at);
  const mergedAt = toDate(pull.merged_at);

  const timeToClose = closedAt - createdAt;
  const timeToMerge = mergedAt && mergedAt - createdAt;
  const timeToResolve = timeToMerge || timeToClose;

  const parsedPull = {
    id: pull.id,
    createdAt: createdAt,
    closedAt: closedAt,
    mergedAt: mergedAt,
    ttc: timeToClose,
    ttm: timeToMerge,
    ttr: timeToResolve,
    state: pull.state,
    createdByLogin: pull.user.login,
    createdByID: pull.user.id,
  };
  return parsedPull
}

const parseCreator = (parsedPull, pull) => {
  const creator = {
    id: pull.user.id,
    login: pull.user.login,
    ttm: parsedPull.ttm,
    ttc: parsedPull.ttc,
    ttr: parsedPull.ttr,
  }
  return creator
}

const run = async (org, repo) => {
  const baseURI = `https://api.github.com/repos/${org}/${repo}`
  const pulls = await getPRs(baseURI);
  const parsedPulls = [];
  const creators = [];
  for (const pull of pulls) {
    const parsedPull = parsePull(pull)
    parsedPulls.push(parsedPull);
    creators.push(parseCreator(parsedPull, pull));
  }
  dal.savePulls(org, repo, parsedPulls);

}


const org = 'kraftman';
const repo = 'create-node-app';

run(org, repo);
