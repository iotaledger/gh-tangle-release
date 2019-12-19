jest.mock('@actions/core');
jest.mock('@actions/github');

const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const run = require('../src/tangle-release.js');

/* eslint-disable no-undef */
describe('Tangle Release', () => {
  let tangleRelease;

  beforeEach(() => {
    tangleRelease = jest.fn().mockReturnValueOnce({
      data: {
        id: 'releaseId',
        html_url: 'htmlUrl',
        upload_url: 'uploadUrl'
      }
    });

    context.repo = {
      owner: 'owner',
      repo: 'repo'
    };

    const github = {
      repos: {
        tangleRelease
      }
    };

    GitHub.mockImplementation(() => github);
  });

  test('Test 1', async () => {
    core.getInput = jest.fn();

    await run();
  });
});
