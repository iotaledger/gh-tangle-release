const run = require('./tangle-release');

if (require.main === module) {
  console.log(`Tangle Release Startup`);
  run();
}
