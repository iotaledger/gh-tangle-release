const axios = require('axios');
const crypto = require('crypto');

async function downloadAndHash(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    });

    if (response.data) {
      const hash = crypto.createHash('sha256');
      hash.update(Buffer.from(response.data, 'binary'));
      return hash.digest('base64');
    }

    throw new Error(`No data in asset ${url}`);
  } catch (err) {
    throw new Error(`Failed retrieving asset ${url}`);
  }
}

module.exports = {
  downloadAndHash
};
