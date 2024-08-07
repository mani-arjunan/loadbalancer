const ConsistentHashing = require("./ConsistentHashing");

const proxy = require("http-proxy").createProxyServer({});

let current = 0;
const roundRobin = (servers, req, res) => {
  const server = servers[current];
  current = (current + 1) % servers.length;

  console.log(`Proxying request to ${server.host}:${server.port}`);
  proxy.web(req, res, { target: `http://${server.host}:${server.port}` });
};

const leastConnections = (servers, req, res) => {
  servers.sort((a, b) => a.connections - b.connections);
  const target = servers[0];

  target.connections++;
  console.log(`Proxying request to ${target.host}:${target.port}`);
  console.log(`Total connections: ${target.connections}`);
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });

  res.on("finish", () => {
    target.connections--;
  });
};

const consistentHashing = (servers, req, res) => {
  const uniqueHeader = req.headers["x-request-id"];
  const cHashing = new ConsistentHashing(servers);
  const target = cHashing.getNode(uniqueHeader);

  console.log(
    `Proxying request to ${target.host}:${target.port} for request ID: ${uniqueHeader}`,
  );
  proxy.web(req, res, { target: `http://${target.host}:${target.port}` });
};

module.exports = {
  roundRobin,
  leastConnections,
  consistentHashing,
};
