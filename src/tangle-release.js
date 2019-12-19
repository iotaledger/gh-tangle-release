/* eslint-disable no-console */
const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const { downloadAndHash } = require('./crypto');
const { attachToTangle } = require('./iota');

async function run() {
  try {
    const github = new GitHub(process.env.GITHUB_TOKEN);

    const seed = process.env.IOTA_SEED;
    const tag = process.env.IOTA_TAG || 'GITHUB9RELEASE';
    let provider = process.env.IOTA_PROVIDER;
    let addressIndex = parseInt(process.env.IOTA_ADDRESS_INDEX, 10);
    let depth = parseInt(process.env.IOTA_DEPTH, 10);
    let mwm = parseInt(process.env.IOTA_MWM, 10);

    if (!seed) {
      throw new Error('You must provide the IOTA_SEED env variable');
    }

    if (!provider || provider.length === 0) {
      provider = 'https://nodes.iota.cafe:443';
    }

    if (Number.isNaN(addressIndex)) {
      addressIndex = 0;
    }

    if (Number.isNaN(mwm)) {
      mwm = 14;
    }

    if (Number.isNaN(depth)) {
      depth = 3;
    }

    const { owner, repo } = context.repo;

    const tagName = core.getInput('tag_name', { required: true });

    const release = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag: tagName.replace('refs/tags/', '')
    });

    // eslint-disable-next-line camelcase
    const { tag_name, name, body, tarball_url, zipball_url, assets } = release.data;

    const tarBallHash = await downloadAndHash(tarball_url);
    const zipBallHash = await downloadAndHash(zipball_url);

    const payload = {
      tag_name,
      name,
      body,
      tarball_url,
      tarball_sig: tarBallHash,
      zipball_url,
      zipball_sig: zipBallHash
    };

    if (assets && assets.length > 0) {
      payload.assets = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < assets.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const assetHash = await downloadAndHash(assets[i].browser_download_url);
        payload.assets.push({
          name: assets[i].name,
          size: assets[i].size,
          url: assets[i].browser_download_url,
          sig: assetHash
        });
      }
    }

    const txHash = await attachToTangle(provider, depth, mwm, seed, addressIndex, tag, payload);
    core.setOutput('tx_hash', txHash);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
