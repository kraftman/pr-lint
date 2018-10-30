'use strict';

const toEpoch = (item) => {
  return item && new Date(item).getTime()/1000;
}

const parseReviews = (rawReviews, commits) => {
  const reviews = [];
  for (const rawReview of rawReviews) {
    const committedAt = toEpoch(commits[rawReview.commit_id]);
    const reviewedAt = toEpoch(rawReview.submitted_at);
    const timeToReview = reviewedAt - committedAt

    reviews.push({
      state: rawReview.state,
      reviewerID: rawReview.user.id,
      submittedAt: toEpoch(rawReview.submitted_at),
      reviewID: rawReview.id,
      timeToReview
    })
  }
  return reviews;
}

const parsePull = (rawPull, rawReviews) => {

  const createdAt = toEpoch(rawPull.created_at);
  const closedAt = toEpoch(rawPull.closed_at);
  const mergedAt = toEpoch(rawPull.merged_at);

  const timeToClose = closedAt && closedAt - createdAt;
  const timeToMerge = mergedAt && mergedAt - createdAt;
  const timeToResolve = timeToMerge || timeToClose;

  const reviewsTotal = rawReviews.length;
  const failedReviews = rawReviews.filter(rev => rev.state == 'REQUEST_CHANGES').length
  const passedReviews = rawReviews.filter(rev => rev.state == 'APPROVE').length
  const commentReviews = rawReviews.filter(rev => rev.state == 'COMMENT').length
  //const averageTimeToReview = rawReviews

  const pull = {
    id: rawPull.id,
    createdAt: createdAt,
    closedAt: closedAt,
    mergedAt: mergedAt,
    ttc: timeToClose,
    ttm: timeToMerge,
    ttr: timeToResolve,
    state: rawPull.state,
    createdByLogin: rawPull.user.login,
    createdByID: rawPull.user.id,
    commits: rawPull.commits,
    additions: rawPull.additions,
    deletions: rawPull.deletions,
    changes: rawPull.additions + rawPull.deletions,
    changedFiles: rawPull.changed_files,
    comments: rawPull.comments,
    reviewsTotal,
    failedReviews,
    passedReviews,
    commentReviews,
    number: rawPull.number
  };
  return pull
}

const getUsers = (pull, reviews, commits) => {
  const uniqueUsers = {};
  if (!uniqueUsers[pull.user.id]) {
    uniqueUsers[pull.user.id] = {
      id: pull.user.id,
      name: pull.user.login,
      badge: pull.user.avatar_url,
    }
  }
  for (const commitID in commits) {
    const commit = commits[commitID]
    if (!uniqueUsers[commit.author.id]) {
      uniqueUsers[commit.author.id] = {
        id: commit.author.id,
        name: commit.author.login
      }
    }
  }
  for (const review of reviews) {
    if (!uniqueUsers[review.user.id]) {
      uniqueUsers[review.user.id] = {
        id: review.user.id,
        name: review.user.login
      }
    }
  }
  const users = [];
  for (const userID in uniqueUsers) {
    users.push(uniqueUsers[userID]);
  }
  return users
}

module.exports = {
  parseReviews,
  parsePull,
  getUsers
}