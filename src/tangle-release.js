/* eslint-disable no-console */
const core = require('@actions/core');
const { context } = require('@actions/github');

async function run() {
  try {
    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = context.repo;

    console.log(JSON.stringify(owner));
    console.log(JSON.stringify(repo));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
