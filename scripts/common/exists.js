const fs = require('fs-extra');

async function doesPathExist(path) {
  try {
    await fs.access(path, fs.F_OK);
    return true;
  } catch (err) {
    console.error(err);
    // It always throws an error when it doesn't exist.
    return false;
  }
}

module.exports = { doesPathExist };
