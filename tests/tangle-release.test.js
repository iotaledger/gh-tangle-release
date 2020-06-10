const core = require('@actions/core');
const run = require('../src/tangle-release');

let inputs = {};

describe('Tangle Release', () => {
  let setFailedMock;
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation();
    setFailedMock = jest.spyOn(core, 'setFailed');
    inputs = {};
    jest.spyOn(core, 'getInput').mockImplementation((name, options) => {
      if (options && options.required && !inputs[name]) {
        throw new Error(`Input required and not supplied: ${name}`);
      }

      return inputs[name];
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('No IOTA_SEED', async () => {
    await run();
    expect(setFailedMock).toHaveBeenCalledWith('You must provide the IOTA_SEED env variable');
  });

  test('No tag_name', async () => {
    process.env.IOTA_SEED = 'A'.repeat(81);
    process.env.GITHUB_REPOSITORY = 'repo1/app1';
    await run();
    expect(setFailedMock).toHaveBeenCalledWith('Input required and not supplied: tag_name');
  });

  test('missing repos', async () => {
    process.env.IOTA_SEED = 'A'.repeat(81);
    process.env.GITHUB_REPOSITORY = 'repo1/app1';
    inputs.tag_name = 'my_tag';
    await run();
    expect(setFailedMock).toHaveBeenCalledWith("Cannot read property 'getReleaseByTag' of undefined");
  });
});
