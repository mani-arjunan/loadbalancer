const http = require("http");
const loadBalancers = require("./loadbalancer");
const serverConfig = require("./server-config.json");

const DEFAULT_LOAD_BALANCER_TYPE = "consistentHashing";

const servers = serverConfig.map((config) => ({
  ...config,
  connections: 0,
}));

const server = http.createServer((req, res) => {
  const headers = req.headers;
  const loadBalancerType =
    headers["loadBalancerType"] || DEFAULT_LOAD_BALANCER_TYPE;

  if (!loadBalancers[loadBalancerType]) {
    res.statusCode = 400;
    res.end("Invalid load balancer type");
    return;
  }

  loadBalancers[loadBalancerType](servers, req, res);
});

server.listen(8000, () => {
  console.log(`Server running at http://localhost:8000/`);
});
