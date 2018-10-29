
'use strict';
const dal = require('./dal/dal-read.js')


const getStats = async (org, repo) => {
  const prIDs = await dal.getPRStats(org, repo)
  const prs = await dal.getPRs(prIDs);

  const out = {
    total: 0,
    totalttc: 0,
    totalttr: 0,
    totalcomments: 0,
    totalcommits: 0,
  }
  prs.forEach(pr => {
    if(pr.state != 'closed') {
      return
    }
    out.total++
    out.totalttc += parseInt(pr.ttc)
    out.totalttr += parseInt(pr.ttr) || 0
    out.totalcomments += parseInt(pr.comments)
    out.totalcommits += parseInt(pr.commits)
  })

  const final = {
    closed: out.total,
    ttc: (out.totalttc/out.total)/60 + ' minutes ',
    ttr: (out.totalttr/out.total)/60 + ' minutes ',
    comments: (out.totalcomments/out.total) + ' comments avg ',
    commits: (out.totalcommits/out.total) + ' commits avg',
  }
  // avg commits
  // avg time to close
  return final
}

const run = async () => {
  const res = await getStats('kraftman', 'create-node-app')
  console.log(res)
}

run()
// Thoughts on potential queries:
// Pulls:
//  - pulls created per time range
//  - pulls merged per time range

// Creators:
//  - pulls created per time range
//  - pulls merged per time range
//  - time to merge per time range
//  - Approval rate: pulls created / reviews rejecting

// Reviews:
//  - pulls reviewed per time range
//  - time to review per time range
//  - approval rate pulls rejected 

// Cumulative stats:
// - trends for pulls per weekday
// - trends for time of day etc

// What does codeclimate velocity do?