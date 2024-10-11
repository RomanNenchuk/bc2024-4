const { program } = require("commander");
const fs = require("fs");
const path = require("path");
const http = require("http");
const superagent = require("superagent");

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

const server = http.createServer((req, res) => {
  const url = req.url;

  if (req.method === "GET") {
    // Ігноруємо запит до favicon.ico
    if (url === "/favicon.ico") {
      res.writeHead(204); // 204 No Content
      res.end();
      return;
    }

    if (fs.existsSync(`./cache${url}.jpeg`)) {
      fs.promises.readFile(`./cache${url}.jpeg`).then((data) => {
        res.setHeader("Content-Type", "image/jpeg");
        res.writeHead(200);
        res.end(data);
      });
    } else {
      res.writeHead(404);
      res.end("Not Found");
    }
  } else if (req.method === "PUT") {
    let body = [];

    req.on("data", (chunk) => {
      body.push(chunk);
    });

    req.on("end", () => {
      const buffer = Buffer.concat(body); // Об'єднуємо всі частини в один буфер

      // Записуємо файл
      fs.writeFile(`./cache${req.url}.jpeg`, buffer, (err) => {
        if (!err) {
          res.writeHead(201);
          res.end("File created successfully");
          return;
        }
        res.writeHead(500);
        res.end("Server error");
      });
    });
  } else if (req.method === "DELETE") {
    fs.unlink(`./cache${url}.jpeg`, (err) => {
      if (!err) {
        res.writeHead(200);
        res.end("File deleted successfully");
        return;
      }
      res.writeHead(404);
      res.end("File not found");
    });
  } else {
    res.writeHead(405);
    res.end("Method not allowed");
  }
});

server.listen(port, host, () => {
  console.log(`Сервер запущений на http://${options.host}:${options.port}`);
});
