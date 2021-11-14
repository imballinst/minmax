const fs = require('fs-extra');
const execa = require('execa');

const { ROOT_FOLDER, SRC_FOLDER, DIST_FOLDER } = require('./constants');
const { doesPathExist } = require('./common/exists');

// Copy all stuff in `src` folder, except `src/dev`.
// Later, the `dist/css/tailwind.css` will be replaced with the purged version, too.
(async () => {
  if (await doesPathExist(DIST_FOLDER)) {
    await fs.rm(DIST_FOLDER, { recursive: true });
  } else {
    await fs.mkdir(DIST_FOLDER);
  }

  await fs.copy(SRC_FOLDER, DIST_FOLDER, {
    recursive: true,
    filter: (src) => {
      // Exclude `src/dev` folder.
      return !src.startsWith(`${ROOT_FOLDER}/src/dev`);
    }
  });

  // Generate the tailwind.
  await execa.command('yarn css:build', { cwd: ROOT_FOLDER });
})();
