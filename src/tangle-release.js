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
    const tangleExplorer = process.env.IOTA_TANGLE_EXPLORER || 'https://utils.iota.org/transaction/:hash';
    const provider = process.env.IOTA_PROVIDER || 'https://nodes.iota.cafe:443';
    let addressIndex = parseInt(process.env.IOTA_ADDRESS_INDEX, 10);
    let depth = parseInt(process.env.IOTA_DEPTH, 10);
    let mwm = parseInt(process.env.IOTA_MWM, 10);

    if (!seed) {
      throw new Error('You must provide the IOTA_SEED env variable');
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
    const comment = core.getInput('comment', { required: false });

    const release = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag: tagName.replace('refs/tags/', '')
    });

    const tarBallHash = await downloadAndHash(release.data.tarball_url);
    const zipBallHash = await downloadAndHash(release.data.zipball_url);

    const payload = {
      owner,
      repo,
      tag_name: release.data.tag_name,
      name: release.data.name,
      comment,
      body: release.data.body,
      tarball_url: release.data.tarball_url,
      tarball_sig: tarBallHash,
      zipball_url: release.data.zipball_url,
      zipball_sig: zipBallHash
    };

    if (release.data.assets && release.data.assets.length > 0) {
      payload.assets = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < release.data.assets.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const assetHash = await downloadAndHash(release.data.assets[i].browser_download_url);
        payload.assets.push({
          name: release.data.assets[i].name,
          size: release.data.assets[i].size,
          url: release.data.assets[i].browser_download_url,
          sig: assetHash
        });
      }
    }

    const txHash = await attachToTangle(provider, depth, mwm, seed, addressIndex, tag, payload);
    const exploreUrl = tangleExplorer.replace(':hash', txHash);
    console.log(`You can view the transaction on the tangle at ${exploreUrl}`);
    core.setOutput('tx_hash', txHash);
    core.setOutput('tx_explore_url', exploreUrl);
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
