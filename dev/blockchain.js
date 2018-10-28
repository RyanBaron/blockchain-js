const sha256 = require('sha256');

const currentNodeUrl = process.argv[3]; // Get the url of the current node, passed as an argument in the start script.

class Blockchain {

  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.currentNodeUrl = currentNodeUrl; // The current node url.
    this.networkNodes = []; // All other node urls in the blockchain neteork.

    // Generate the genesis block (the first block on the blockchain).
    this.createNewBlock( 2018, 'RyanBaron', 'GenesisBlock' );
  }

  // createNewBlock method.
  createNewBlock( nonce, previousBlockHash, hash ) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions, // New transactions added since the last block was mined.
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash
    };

    // Clear out the new transacitons, as they were added to the above block.
    this.pendingTransactions = [];

    // Add the new block to our chain.
    this.chain.push( newBlock );

    // Return the newBlock.
    return newBlock;
  }

  // getLastBlock method.
  getLastBlock () {
    return this.chain[this.chain.length - 1];
  }

  // createNewTransaciton method.
  createNewTransaction( amount, sender, recipient ) {

    // Create a newTransaction object.
    const newTransaction = {
      amount: amount,
      sender: sender,
      recipient: recipient
    }

    // Push the new transation to the pendingTransactions array.
    this.pendingTransactions.push( newTransaction );

    // Return the numbe rof the block tht this transation will be added to.
    return this.getLastBlock()['index'] + 1;
  }

  // hashblock method.
  hashBlock( previousBlockHash, currentBlockData, nonce ) {
    // Cocatinate all of our passed in data into a single string.
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify( currentBlockData );

    // Hash dataAsString.
    const hash = sha256( dataAsString );

    // Return the hash.
    return hash;
  }

  // proofOfWork method.
  proofOfWork( previousBlockHash, currentBlockData ) {
    let nonce = 0;
    let hash = this.hashBlock( previousBlockHash, currentBlockData, nonce );

    // Each loop generates a new hash value
    // Incrementing the nonce value by 1 until we get hash value that starts with '0000'.
    while( hash.substring( 0, 4 ) !== '0000' ) {
      nonce++;
      hash = this.hashBlock( previousBlockHash, currentBlockData, nonce );
    }

    // Return the nonce value that gives the hash a value that starts with '0000'.
    return nonce;
  }
}

module.exports = Blockchain;
