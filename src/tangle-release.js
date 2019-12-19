/* eslint-disable no-console */
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');

async function run() {
  try {
    const github = new GitHub(process.env.GITHUB_TOKEN);

    const { owner, repo } = context.repo;

    const tagName = core.getInput('tag_name', { required: true });

    const release = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag: tagName.replace('refs/tags/', '')
    });

    // eslint-disable-next-line camelcase
    const { url, assets_url, upload_url, html_url, name, body, tarball_url, zipball_url, assets } = release.data;

    console.log('url', url);
    console.log('assets_url', assets_url);
    console.log('upload_url', upload_url);
    console.log('html_url', html_url);
    console.log('name', name);
    console.log('body', body);
    console.log('tarball_url', tarball_url);
    console.log('zipball_url', zipball_url);
    console.log('assets', assets);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
