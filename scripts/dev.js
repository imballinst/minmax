const chokidar = require('chokidar');
const path = require('path');
const io = require('socket.io');
const http = require('http');
const execa = require('execa');
const fs = require('fs/promises');
const handler = require('serve-handler');

// Constants.
const ROOT_FOLDER = path.join(__dirname, '../');
const SRC_FOLDER = path.join(__dirname, '../src');
const NODE_MODULES_FOLDER = path.join(__dirname, '../node_modules');

// Watch for file changes, then ask browser to reload.
const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  return handler(request, response, {
    public: SRC_FOLDER
  });
});

const PATH_TO_SOCKET_CLIENT_SOURCE = path.join(
  NODE_MODULES_FOLDER,
  'socket.io/client-dist/socket.io.js'
);
const PATH_TO_SOCKET_IO_DEV = path.join(SRC_FOLDER, 'dev/socket.io.js');

server.listen(3000, async () => {
  const isSocketIoClientCopied = await doesFileExist(PATH_TO_SOCKET_IO_DEV);

  if (!isSocketIoClientCopied) {
    await fs.copyFile(PATH_TO_SOCKET_CLIENT_SOURCE, PATH_TO_SOCKET_IO_DEV);
  }

  console.info('[server] Running at http://localhost:3000.');
});

const socket = new io.Server(server);

chokidar
  .watch(SRC_FOLDER, {
    ignored: [`${SRC_FOLDER}/css/tailwind.css`]
  })
  .on('change', async (path) => {
    console.info(`[server] Refreshing browser due to file change: ${path}.`);

    // Here, we always regenerate the CSS but since it's very quick (<150ms), I think
    // it should be fine. We can improve it later.
    await execa.command('yarn css:generate', { cwd: ROOT_FOLDER });

    socket.sockets.emit('reload');
  });

// Helper functions.
async function doesFileExist(path) {
  try {
    await fs.access(path, fs.F_OK);
    return true;
  } catch (err) {
    // It always throws an error when it doesn't exist.
    return false;
  }
}
