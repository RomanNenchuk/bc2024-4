const { program } = require("commander");

const http = require("http");

program
  .option("-h, --host <server address>", "server address")
  .option("-p, --port <server port>", "server port number")
  .option("-C, --Cache <path>", "path to the directory with cached files");

program.parse(process.argv);
const options = program.opts();
const host = options.host;
const port = options.port;
const сache = options.Cache;

if (!host) {
  console.error("Please, specify server address (host)");
  process.exit(1);
}
if (!port) {
  console.error("Please, specify server port number");
  process.exit(1);
}
if (!сache) {
  console.error("Please, specify the path to the directory with cached files");
  process.exit(1);
}

const server = http.createServer((req, res) => {});

server.listen(port, host, () => {
  console.log(`Сервер запущений на http://${options.host}:${options.port}`);
});
