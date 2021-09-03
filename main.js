const SHA256 = require('crypto-js/sha256');

class Block {
   
    constructor(data, timestamp, previousHash = '') {
        this.data = data;
        this.hash = this.calculateHash();
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        //this.nonce = nonce;
    }

    calculateHash() {
        return SHA256(JSON.stringify(this.data),this.previousHash, this.timestamp/*, this.nonce*/).toString();
    }
}

class Chain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        //this.nonce = 2;
    }

    createGenesisBlock() {
        return new Block("Genesis Block", Date.now(), "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let blockchain = new Chain();
blockchain.addBlock(new Block({from: "mike", to: "john", amount: 20}, Date.now()));
blockchain.addBlock(new Block({from: "bob", to: "mary", amount: 40}, Date.now()));

console.log(JSON.stringify(blockchain, null, 4));