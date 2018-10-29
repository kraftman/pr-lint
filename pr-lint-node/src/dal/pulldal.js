'use strict'
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);
const client = redis.createClient()

const savePR = async (org, repo, pull) => {
  const pullID = `pr:${pull.id}`
  const setKey = `pr:time:${org}:${repo}`
  await client.zadd(setKey, pull.createdAt, pullID)
  const setStateKey = setKey + ':'+pull.state;
  await client.zadd(setStateKey, pull.createdAt, pullID)
}

const saveCreator = async (org, repo, pull) => {
  const setKey = `time:${org}:${repo}`
  const pullID = `pr:${pull.id}`
  // tracking all users prs for a repo
  const setUserKey = 'pr:creator:' + setKey + ':' + pull.createdByID;
  await client.zadd(setUserKey, pull.createdAt, pullID)

  // refine by state, could also be done in code?
  const setUserStateKey = 'pr:creator:state:' + setKey + ':' + pull.state;
  await client.zadd(setUserStateKey, pull.createdAt, pullID)

  // so we can query all a users prs across all repos
  const setCreatorIDKey = 'pr:creator:time:' + pull.createdByID;
  await client.zadd(setCreatorIDKey, pull.createdAt, pullID)
}

// const saveReviewer = (org, repo, pull) => {
//   const setKey = `pr:reveiwer:time:${org}:${repo}`;
//   const setUserKey = setKey + ':' + pull.review;
//   client.zadd(setUserKey, pull.createdAt, pull.id)
//   const setUserStateKey = setKey + ':' + pull.state;
//   client.zadd(setUserStateKey, pull.createdAt, pull.id)
// }

const savePull = async (org, repo, pull) => {
  // key = org:repo:closed/merged
  const pullKey = `pr:${pull.id}`
  try {
    await client.hmset(pullKey, pull)
    await savePR(org, repo, pull)
    await saveCreator(org, repo, pull)
  
  } catch (err) {
    console.log(err)
  }
}

const savePulls = async (org, repo, pulls) => {
  for(const pull of pulls) {
    await savePull(org, repo, pull)
  }
}

const saveReviewTime = async (org, repo, review) => {
  const reviewKey = `review:${org}:${repo}:${review.reviewID}`
  const zKey = `time:review:${org}:${repo}`
  await client.zadd(zKey, review.submittedAt, reviewKey)
}

const saveReview = async (org, repo, review) => {
  const reviewKey = `review:${org}:${repo}:${review.reviewID}`
  try {
    await client.hmset(reviewKey, review)
    await saveReviewTime(org, repo, review)
  
  } catch (err) {
    console.log(err)
  }
}

const saveReviews = async (org, repo, reviewers) => {
  for(const reviewer of reviewers) {
    await saveReview(org, repo, reviewer)
  }
}

const saveUser = async (org, repo, user) => {
  const userKey = 'user:'+user.id;
  await client.hmset(userKey, user)
}
const saveUsers = async (org, repo, users) => {
  for(const user of users) {
    await saveUser(org, repo, user)
  }
}

module.exports = {
  savePulls,
  saveReviews,
  saveUsers
}