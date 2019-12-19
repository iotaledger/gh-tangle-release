const core = require('@actions/core');
const { context } = require('@actions/github');

async function run() {
  try {
    // Get owner and repo from context of payload that triggered the action
    const { owner, repo } = context.repo;

    core.debug(JSON.stringify(owner));
    core.debug(JSON.stringify(repo));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
