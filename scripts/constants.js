const path = require('path');

// Constants.
const ROOT_FOLDER = path.join(__dirname, '..');
const SRC_FOLDER = path.join(__dirname, '../src');
const DIST_FOLDER = path.join(__dirname, '../dist');
const NODE_MODULES_FOLDER = path.join(__dirname, '../node_modules');

module.exports = {
  ROOT_FOLDER,
  SRC_FOLDER,
  DIST_FOLDER,
  NODE_MODULES_FOLDER
};
