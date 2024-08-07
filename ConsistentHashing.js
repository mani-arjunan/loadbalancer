const crypto = require("crypto");

class ConsistentHashing {
  constructor(nodes, replicas = 10) {
    this.replicas = replicas;
    this.ring = new Map();
    this.keys = [];

    nodes.forEach((node) => {
      this.addNode(node);
    });
  }

  hash(key) {
    return parseInt(
      crypto.createHash("md5").update(key).digest("hex").slice(0, 3),
      16,
    );
  }

  addNode(node) {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${node.host}:${node.port}-${i}`);

      this.ring.set(hash, node);
      this.keys.push(hash);
    }

    this.keys.sort((a, b) => a - b);
  }

  removeNode(node) {
    for (let i = 0; i < this.replicas; i++) {
      const hash = this.hash(`${node.host}:${node.port}-${i}`);

      this.ring.delete(hash);
      this.keys.splice(this.keys.indexOf(hash), 1);
    }
  }

  getNode(key) {
    if (this.ring.size === 0) {
      return null;
    }

    const hash = this.hash(key);

    let low = 0;
    let high = this.keys.length - 1;
    let midPoint = Math.floor((high - low) / 2);

    while (low <= high) {
      if (hash < this.keys[midPoint]) {
        if (hash > this.keys[midPoint - 1]) {
          return this.ring.get(this.keys[midPoint]);
        }
        high = midPoint - 1;
        midPoint = low + Math.floor((high - low) / 2);
      } else {
        if (hash < this.keys[midPoint + 1]) {
          return this.ring.get(this.keys[midPoint + 1]);
        }
        low = midPoint + 1;
        midPoint = low + Math.floor((high - low) / 2);
      }
    }

    return this.ring.get(this.keys[0]);
  }
}

// const c1 = new ConsistentHashing([
//   { host: "localhost", port: 3012 },
//   { host: "localhost", port: 3013 },
// ]);
// console.log(c1.ring);
// console.log(c1.keys.sort((a, b) => a - b));
// console.log(c1.getNode("a"));
module.exports = ConsistentHashing;
