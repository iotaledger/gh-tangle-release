/* eslint-disable no-console */
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const { downloadAndHash } = require('./crypto');

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

    const tarBallHash = await downloadAndHash(tarball_url);
    const zipBallHash = await downloadAndHash(zipball_url);

    console.log('url', url);
    console.log('assets_url', assets_url);
    console.log('upload_url', upload_url);
    console.log('html_url', html_url);
    console.log('name', name);
    console.log('body', body);
    console.log('tarball_url', tarball_url);
    console.log('zipball_url', zipball_url);
    console.log('tarBallHash', tarBallHash);
    console.log('zipBallHash', zipBallHash);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < assets.length; i++) {
      console.log(`assets ${i}: name`, assets[i].name);
      console.log(`assets ${i}: size`, assets[i].size);
      console.log(`assets ${i}: content type`, assets[i].content_type);
      console.log(`assets ${i}: url`, assets[i].browser_download_url);

      // eslint-disable-next-line no-await-in-loop
      const assetHash = await downloadAndHash(assets[i].browser_download_url);
      console.log(`assets ${i}: hash`, assetHash);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
