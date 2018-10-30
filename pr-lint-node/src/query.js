
'use strict';
const dal = require('./dal/dal-read.js')


const rangeMap = {
  days: 86400,
  weeks: 604800,
}

const getPRs = async (org, repo, startAt, endAt) => {
  const prIDs = await dal.getPRStats(org, repo, startAt, endAt)
  const prs = await dal.getPRs(prIDs);
  return prs
}

const getCreators = async (prs) => {
  const creatorIDs = prs.map(pr => pr.createdByID);
  return await dal.getUsers(creatorIDs)
}

const addPRToInterval = (pr, interval) => {

  const stats = interval.prStats
  stats.total++
  stats.totalttc += parseInt(pr.ttc) || 0
  stats.totalttr += parseInt(pr.ttr) || 0
  stats.totalcomments += parseInt(pr.comments)
  stats.totalcommits += parseInt(pr.commits)

  interval.prs.push(pr)
}

const getDefaultCreatorValues = () => {
  return {
    opened: 0,
    closed: 0,
    merged: 0,
    totalLinesChanged: 0,
    totalLinesDeleted: 0,
    totalLinesAdded: 0,
    totalCommits: 0,
    totalCommentsRecieved: 0,
    totalttr: 0
  }
}

const addCreatorToInterval = (pr, interval) => {
  const stats = interval.creatorStats;
  const createdByID = pr.createdByID
  if (!stats[createdByID]) {
    stats[createdByID] = getDefaultCreatorValues();
    const creatorStats = stats[createdByID]
    
    creatorStats.opened++
    if (pr.state === 'closed') {
      creatorStats.closed++
    } else if (pr.state === 'merged') {
      creatorStats.closed++
    }

    creatorStats.totalLinesChanged += parseInt(pr.changes),
    creatorStats.totalLinesDeleted+= parseInt(pr.deletions),
    creatorStats.totalLinesAdded+= parseInt(pr.additions),
    creatorStats.totalCommits+= parseInt(pr.commits),
    creatorStats.totalCommentsRecieved+= parseInt(pr.comments),
    creatorStats.totalttr+= parseInt(pr.ttr)

  }
}

const sortPrsToIntervals = (prs, intervals) => {
  prs.sort((a,b) => a.createtAt < b.createtAt);

  prs.forEach(pr => {
    // add across the whole period
    addPRToInterval(pr, intervals.total)
    addCreatorToInterval(pr, intervals.total)

    // replace with proper modulus calc laters
    // grab the first interval that this pr fits into
    const subInterval = intervals.intervals.find(int => pr.createdAt > int.start && pr.createdAt < int.end);
    addPRToInterval(pr, subInterval)
    addCreatorToInterval(pr, subInterval)
  })

}

const getDefaultIntervalValues = (start, end) => {
  return {
    start: start,
    end: end,
    prStats: {
      total: 0,
      totalttc: 0,
      totalttr: 0,
      totalcomments: 0,
      totalcommits: 0,
    },
    creatorStats: {
      
    },
    prs: []
  }
}

const getIntervals = (start, end, intervalSize) => {
  const intervals = {
    total: getDefaultIntervalValues(start,end),
    intervals: []
  }
  for (let iStart = start; iStart <= end; iStart = iStart + intervalSize) {
    const iEnd = iStart + intervalSize
    intervals.intervals.push(getDefaultIntervalValues(iStart, iEnd))
  }
  return intervals
}

const getCreatorStatTotals = (creatorStats, creators) => {
  const converted = {}
  for(const [creatorID, stats] of Object.entries(creatorStats)) {
    const creator = creators.find(creator => creator.id === creatorID)
    converted[creator.name] = {
      name: creator.name,
      id: creator.id,
      opened: stats.opened,
      closed: stats.closed,
      linesChanged: Math.floor((stats.totalLinesChanged)/stats.opened + 0.5),
      linesDeleted: Math.floor((stats.totalLinesDeleted)/stats.opened + 0.5),
      linesAdded:   Math.floor((stats.totalLinesAdded)/stats.opened + 0.5),
      commits:   Math.floor((stats.totalCommits)/stats.opened + 0.5),
      commentsRecieved:   Math.floor((stats.totalCommentsRecieved)/stats.opened + 0.5),
      timeToResolve:   Math.floor((stats.totalttr)/stats.opened + 0.5),
    }
  }
  return converted
}

const getPRStatTotals = (prStats, total) => {
  return {
    ttc: Math.floor((prStats.totalttc/total)/60) + ' minutes ',
    ttr: Math.floor((prStats.totalttr/total)/60) + ' minutes ',
    comments: Math.floor((prStats.totalcomments/total)) + ' comments avg ',
    commits: Math.floor((prStats.totalcommits/total)) + ' commits avg',
  }
}

const convertIntervals = (intervals, creators) => {
  const converted = {
    total: {
      prStats: getPRStatTotals(intervals.total.prStats, intervals.total.prStats.total),
      creatorStats: getCreatorStatTotals(intervals.total.creatorStats, creators)
    },
    intervals: {},
  }
  intervals.intervals.forEach(interval => {
    if (interval.prStats.total < 1 ) {
      return
    } 
    converted.intervals[interval.start] = {
      start: interval.start,
      end: interval.end,
      opened: interval.prStats.total,
      prStats: getPRStatTotals(interval.prStats, interval.prStats.total),
      creatorStats: getCreatorStatTotals(interval.creatorStats, creators),
      prs: interval.prs,
    }
  })
  return converted
}

const getStats = async (org, repo, startAt, endAt, interval) => {
  const prs = await getPRs(org, repo, startAt, endAt);
  const creators = await getCreators(prs);

  const intervalSize = rangeMap[interval];
  const intervals = getIntervals(startAt, endAt, intervalSize)

  sortPrsToIntervals(prs, intervals)
  const out = convertIntervals(intervals, creators)

  return out
}

const run = async () => {
  const endAt= Math.floor((new Date()).getTime()/1000)
  const startAt = endAt - 604800*6 //all for now
  const res = await getStats('kraftman', 'create-node-app', startAt, endAt, 'days')
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