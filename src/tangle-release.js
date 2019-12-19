/* eslint-disable no-console */
const core = require('@actions/core');
const { context } = require('@actions/github');

async function run() {
  try {
    console.log(JSON.stringify(context));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
