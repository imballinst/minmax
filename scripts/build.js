const fs = require('fs-extra');
const execa = require('execa');

const {
  ROOT_FOLDER,
  SRC_FOLDER,
  DIST_FOLDER,
  NODE_MODULES_FOLDER
} = require('./constants');
const { doesPathExist } = require('./common/exists');
const gtag = require('./injects/gtag');

const PATH_TO_DIST_INDEX_HTML = `${DIST_FOLDER}/index.html`;

// Copy all stuff in `src` folder, except `src/dev`.
// Later, the `dist/css/tailwind.css` will be replaced with the purged version, too.
async function main() {
  // Cleanup.
  if (await doesPathExist(DIST_FOLDER)) {
    await fs.rm(DIST_FOLDER, { recursive: true });
  } else {
    await fs.mkdir(DIST_FOLDER);
  }

  // If Tailwind CSS raw file doesn't exist, generate it.
  if (!(await doesPathExist(`${SRC_FOLDER}/css/tailwind.css`))) {
    await execa.command('yarn css:generate', { cwd: ROOT_FOLDER });
  }

  await fs.copy(SRC_FOLDER, DIST_FOLDER, {
    recursive: true,
    filter: (src) => {
      // Exclude `src/dev` and `src/css` folder.
      return (
        !src.startsWith(`${ROOT_FOLDER}/src/dev`) &&
        !src.startsWith(`${ROOT_FOLDER}/src/css`)
      );
    }
  });

  // Generate the minified Tailwind CSS.
  const stamp = new Date().valueOf();
  const mainCssFilename = `main-${stamp}.css`;

  await execa.command(
    `yarn tailwindcss -i ./src/css/tailwind.css -o ./dist/css/${mainCssFilename} --minify`,
    {
      cwd: ROOT_FOLDER,
      env: {
        NODE_ENV: 'production'
      }
    }
  );

  // Remove the dev scripts from index.html.
  const content = await fs.readFile(PATH_TO_DIST_INDEX_HTML, 'utf-8');
  const contentArray = content.split('\n');
  let cleanedHtmlArray = [];
  let isLineIncluded = true;

  for (const line of contentArray) {
    const trimmed = line.trim();

    // Remove some sets of lines.
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

  // If process.env.CONTEXT === 'production', inject scripts.
  if (process.env.CONTEXT === 'production') {
    cleanedHtmlArray = cleanedHtmlArray
      .slice(0, -2)
      .concat(gtag)
      .concat(cleanedHtmlArray.slice(-2));
  }

  await fs.writeFile(
    PATH_TO_DIST_INDEX_HTML,
    cleanedHtmlArray.join('\n').replace('tailwind.css', mainCssFilename)
  );
}

main();
