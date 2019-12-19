/* eslint-disable no-console */
async function attachToTangle(provider, depth, mwm, seed, addressIndex, payload) {
  console.log('provider', provider);
  console.log('depth', depth);
  console.log('mwm', mwm);
  console.log('seed', seed);
  console.log('addressIndex', addressIndex);
  console.log('payload', payload);
  return 'A'.repeat(81);
}

module.exports = {
  attachToTangle
};
