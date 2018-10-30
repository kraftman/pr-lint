
const axios = require('axios')
require('dotenv').config();

class Api {
  constructor(token) {
    this.token = token || process.env.GITHUB_TOKEN;
  }
  createConfig (URI) {
    console.log('token: ', this.token)
    return {
      method: 'GET',
      url: URI,
      headers: {
        Authorization: 'token ' + this.token,
      },
      json: true,
    };
  };


  async getPRs (baseURI) {
    const pullURI = baseURI+'/pulls?state=all&per_page=100'
    try {
      const config = this.createConfig(pullURI)
      const result = await axios(config);
      return result.data
    } catch (err) {
      console.log('err getting from axios: ', err)
    }
  };

  async getPR (baseURI, pullNumber) {
    const pullURI = baseURI+'/pulls/'+pullNumber;
    try {
      const config = this.createConfig(pullURI)
      const result = await axios(config);
      return result.data
    } catch (err) {
      console.log('err getting from axios: ', err)
    }
  }

  async getPullReviews (baseURI, pullNumber) {
    const pullURI = `${baseURI}/pulls/${pullNumber}/reviews`;
    console.log(pullURI)
    try {
      const config = this.createConfig(pullURI)
      const result = await axios(config);
      return result.data
    } catch (err) {
      console.log('err getting from axios: ', err.response.status, err.response.statusText)
    }
  }

  async getCommit (baseURI, commitSha) {
    const pullURI = `${baseURI}/commits/${commitSha}`;
    try {
      const config = this.createConfig(pullURI)
      const result = await axios(config);
      return result.data
    } catch (err) {
      console.log('err getting from axios: ', err)
    }
  }

  async getCommits (baseURI, commitIds) {
    const commits = {};
    for (const id of commitIds) {
      commits[id] = await this.getCommit(baseURI, id)
    }
    return commits;
  }
}

module.exports = Api