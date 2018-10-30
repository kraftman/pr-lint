'use strict';

const dal = require('./dal/dal-write.js');
const parser = require('./bl/parser.js');
const api = require('./external/github-api.js')

const baseDomain = 'https://api.github.com/';
const org = 'kraftman';
const repo = 'create-node-app';

const run = async (org, repo) => {
  const baseURI = baseDomain + `/repos/${org}/${repo}`
  const pulls = await api.getPRs(baseURI);
  const parsedPulls = [];
  const parsedReviews = [];
  let users = [];

  for (const { number } of pulls) {
    const pullReviews = await api.getPullReviews(baseURI, number)
    const fullPull = await api.getPR(baseURI, number)

    const reviewCommitIDs = pullReviews.map(rev => rev.commit_id);
    const commits = await api.getCommits(baseURI, reviewCommitIDs)
    const parsedReviews = parser.parseReviews(pullReviews, commits)

    parsedReviews.push(parsedReviews)

    const parsedPull = parser.parsePull(fullPull, parsedReviews)
    parsedPulls.push(parsedPull);
    const newUsers = parser.getUsers(fullPull, pullReviews, commits)
    users = users.concat(newUsers)
  }

  await dal.savePulls(org, repo, parsedPulls);
  await dal.saveReviews(org, repo, parsedReviews);
  await dal.saveUsers(org, repo, users)

}



run(org, repo);
