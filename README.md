# LoadBalancer

A simple loadbalancer setup in nodejs, with 3 algorithm (roundrobin, leastconn, consistent-hashing) and 10 servers.

### RoundRobin Algorithm
Roundrobin algorithm routes requests to servers in circular fashion. 

### LeastConn Algorithm
LeastConn algorithm routes requests to the server with least number of connections.

### Consistent-hashing Algorithm
Consistent-hashing algorithm routes requests to the server with least hash value.
[source](https://www.geeksforgeeks.org/consistent-hashing/)
