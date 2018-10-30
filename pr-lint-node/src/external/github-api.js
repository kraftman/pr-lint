
const axios = require('axios')
require('dotenv').config();
const token = ''; //process.env.GITHUB_TOKEN

const createConfig = (URI) => {
  return {
    method: 'GET',
    url: URI,
    headers: {
      Authorization: 'token ' + tempkey,
    },
    json: true,
  };
};


const getPRs = async (baseURI) => {
  const pullURI = baseURI+'/pulls?state=all&per_page=100'
  try {
    const config = createConfig(pullURI)
    const result = await axios(config);
    return result.data
  } catch (err) {
    console.log('err getting from axios: ', err)
  }
};

const getPR = async (baseURI, pullNumber) => {
  const pullURI = baseURI+'/pulls/'+pullNumber;
  try {
    const config = createConfig(pullURI)
    const result = await axios(config);
    return result.data
  } catch (err) {
    console.log('err getting from axios: ', err)
  }
}

const getPullReviews = async (baseURI, pullNumber) => {
  const pullURI = `${baseURI}/pulls/${pullNumber}/reviews`;
  console.log(pullURI)
  try {
    const config = createConfig(pullURI)
    const result = await axios(config);
    return result.data
  } catch (err) {
    console.log('err getting from axios: ', err.response.status, err.response.statusText)
  }
}

const getCommit = async(baseURI, commitSha) => {
  const pullURI = `${baseURI}/commits/${commitSha}`;
  try {
    const config = createConfig(pullURI)
    const result = await axios(config);
    return result.data
  } catch (err) {
    console.log('err getting from axios: ', err)
  }
}

const getCommits = async (baseURI, commitIds) => {
  const commits = {};
  for (const id of commitIds) {
    commits[id] = await getCommit(baseURI, id)
  }
  return commits;
}

module.exports = {
  getPRs,
  getPR,
  getPullReviews,
  getCommit,
  getCommits,
}