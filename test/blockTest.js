const assert = require('assert');
const { Block } = require('../src/main');

let block = null;

beforeEach(function() {
    block = new Block({from: "bob", to: "alice", amount: 10}, 1005, 'prevHash');
});

describe('Block class', function() {
    
    describe('Constructor', function() {
        it('initializes with the correct values', function() {
            assert.strict.equal(block.timestamp, 1005);
            assert.strict.equal(block.nonce, 0);
            assert.strict.equal(block.previousHash, 'prevHash');
        });
    });

    describe('Mining', function() {
        it('should calculate correctly the hash', function() {
            block.mineBlock(4);
            assert.strict.equal(block.hash, '0000a22fce664810dba64b2acd0456058fdb81ad5dc233043766cd0f3fbce2a2');
        });
    });
});