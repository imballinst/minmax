const chokidar = require('chokidar');
const path = require('path');
const io = require('socket.io');
const http = require('http');
const fs = require('fs/promises');
const handler = require('serve-handler');

// Constants.
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

chokidar.watch(SRC_FOLDER).on('change', () => {
  socket.sockets.emit('reload');
  console.info('[server] Refreshing browser due to file change.');
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
