/* eslint-disable no-console */
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {
  try {
    const github = new GitHub(process.env.GITHUB_TOKEN);

    const { owner, repo } = context.repo;

    const tagName = core.getInput('tag_name', { required: true });

    const release = github.repos.getReleaseByTag({
      owner,
      repo,
      tag: tagName.replace('refs/tags/', '')
    });

    console.log(release);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
