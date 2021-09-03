/* Basic Blockchain in JavaScript 
 * The chain is an array of blocks and each block contains a set of data
 * Blocks link with one another through a cryptographic validation, which creates a blockchain
 */

const SHA256 = require('crypto-js/sha256');

class Block {
   
    constructor(data, timestamp, previousHash = '') {
        this.data = data;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = '';
        this.nonce = 0;
    }

    /* Mining function that calculates the hashes
     * The hash starts with n 0, depending on the difficulty
     * Nonce is increased by 1 in every iteration
     * 1 ms delay to ensure that every block timestamp is unique  
     */
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash(this.data, this.timestamp, this.previousHash, this.nonce);
        }
        this.sleep(1);
    }

    /* Calculates a hash based on the data, timestamp, previous hash and nonce */
    calculateHash(data, timestamp, previousHash, nonce) {
        return SHA256(JSON.stringify(data) + timestamp + previousHash + nonce).toString();
    }

    /* Sleep function to guarantee the uniqueness of the timestamp when a block is mined */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class Chain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 1;
    }
    
    /* Creates the first block of the chain */
    createGenesisBlock() {
        return new Block("Genesis Block", Date.now(), "");
    }

    /* Returns the latest block of the chain */
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /* Adds a new block at the end of the chain
     * Gets the previous hash and mines the new block with a given difficulty
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    /* Validates the integrity of the chain
     * Iterates the chain and checks that the hashes and the timestamp of each block have not been altered
     */
    isChainValid() {
        for(let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            /* Check if the previous hash is correct */
            if(currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
            /* Check if the current hash is correct */
            if(currentBlock.hash !== currentBlock.calculateHash(currentBlock.data, currentBlock.timestamp, currentBlock.previousHash, currentBlock.nonce)) {
                return false;
            }
            /* Check if the current timestamp is later in time than the previous block timestamp */
            if(currentBlock.timestamp <= previousBlock.timestamp) {
                return false;
            }            
        }
        return true;
    }
}