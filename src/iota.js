const { composeAPI, generateAddress } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter');

function encodeNonASCII(value) {
  return value
    ? value.replace(/[\u007F-\uFFFF]/g, chr => `\\u${`0000${chr.charCodeAt(0).toString(16)}`.substr(-4)}`)
    : undefined;
}

/* eslint-disable no-console */
async function attachToTangle(provider, depth, mwm, seed, addressIndex, tag, payload) {
  console.log('provider', provider);
  console.log('depth', depth);
  console.log('mwm', mwm);
  console.log('seed', seed);
  console.log('addressIndex', addressIndex);
  console.log('payload', payload);

  const json = JSON.stringify(payload);
  console.log(json);
  const ascii = encodeNonASCII(json);
  console.log(ascii);
  const message = asciiToTrytes(ascii);
  console.log(message);

  const iota = composeAPI({
    provider
  });

  const address = generateAddress(seed, addressIndex);

  const trytes = await iota.prepareTransfers('9'.repeat(81), [
    {
      address,
      value: 0,
      message,
      tag
    }
  ]);

  const bundles = await iota.sendTrytes(trytes, depth, mwm);

  return bundles[0].hash;
}

module.exports = {
  attachToTangle
};
