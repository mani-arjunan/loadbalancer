const http = require("http");
const serverConfig = require("./server-config.json");

serverConfig.forEach((config) => {
  http
    .createServer((req, res) => {
      const timeout = config.timeout;

      setTimeout(() => {
        res.statusCode = 200;
        res.write("Hello");
        res.end("Hello World");
      }, timeout);
    })
    .listen(config.port, config.host, () => {
      console.log(`Server running at http://${config.host}:${config.port}/`);
    });
});
