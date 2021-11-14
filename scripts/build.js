const fs = require('fs-extra');
const execa = require('execa');

const { ROOT_FOLDER, SRC_FOLDER, DIST_FOLDER } = require('./constants');
const { doesPathExist } = require('./common/exists');

const PATH_TO_DIST_INDEX_HTML = `${DIST_FOLDER}/index.html`;

// Copy all stuff in `src` folder, except `src/dev`.
// Later, the `dist/css/tailwind.css` will be replaced with the purged version, too.
async function main() {
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

  // Generate the minified Tailwind CSS.
  await execa.command('yarn css:build', { cwd: ROOT_FOLDER });

  // Remove the dev scripts from index.html.
  const content = await fs.readFile(PATH_TO_DIST_INDEX_HTML, 'utf-8');
  const contentArray = content.split('\n');
  const cleanedHtmlArray = [];
  let isLineIncluded = true;

  for (const line of contentArray) {
    const trimmed = line.trim();

    if (trimmed.startsWith('<!-- [remove-on-prod:start')) {
      isLineIncluded = false;
    }

    if (isLineIncluded) {
      cleanedHtmlArray.push(line);
    }

    if (trimmed.startsWith('<!-- [remove-on-prod:finish')) {
      isLineIncluded = true;
    }
  }

  await fs.writeFile(PATH_TO_DIST_INDEX_HTML, cleanedHtmlArray.join('\n'));
}

main();
