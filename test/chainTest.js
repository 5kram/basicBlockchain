const assert = require('assert');
const { Chain } = require('../src/main');
const { Block } = require('../src/main');


let blockchain = null;

beforeEach(function() {
    blockchain = new Chain();
});

describe('Chain class', function() {
    
    describe('Constructor', function() {
        it('initializes with the correct values', function() {
            assert.strict.equal(blockchain.difficulty, 4);
        });
    });

    describe('Genesis Block', function() {
        it('should initialize Genesis Block correctly', function() {
            assert.strict.deepEqual(blockchain.chain[0], blockchain.createGenesisBlock());
        });
    });

    describe('Chain Validation', function() {
        it('returns true if chain is not altered', function() {
            blockchain.createGenesisBlock();
            blockchain.addBlock(new Block({from: "bob", to: "alice", amount: 20}, 1001));
            blockchain.addBlock(new Block({from: "alice", to: "bob", amount: 40}, 1002));
            assert(blockchain.isChainValid());
        });

        it('should fail if Genesis timestamp is altered', function() {
            blockchain.chain[0].timestamp = 0000;
            assert(!blockchain.isChainValid());
        });
        
        it('should fail if the current block hash is altered', function() {
            blockchain.addBlock(new Block({from: "bob", to: "alice", amount: 20}, Date.now()/1000 | 0));
            blockchain.chain[1].hash = 'wrongHash';
            assert(!blockchain.isChainValid());
        });

        it('should fail if the current block timestamp is altered', function() {
            blockchain.addBlock(new Block({from: "bob", to: "alice", amount: 20}, Date.now()/1000 | 0));
            blockchain.chain[1].timestamp = 1111;
            assert(!blockchain.isChainValid());
        });

        it('should fail if a previous block hash is altered', function() {
            blockchain.addBlock(new Block({from: "bob", to: "alice", amount: 20}, 1001));
            blockchain.addBlock(new Block({from: "alice", to: "bob", amount: 40}, 1002));
            blockchain.chain[1].data = {from: "bob", to: "bob", amount: 20};
            blockchain.chain[1].hash = blockchain.chain[1].calculateHash({from: "bob", to: "bob", amount: 20}, 1001);
            assert(!blockchain.isChainValid());
        });
    });
});