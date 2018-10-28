class Blockchanin {

  constructor() {
    this.chain = [];
    this.newTransactions = [];
  }

  // createNewBlock method
  createNewBlock( nonce, previousBlockHash, hash ) {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transaction: this.newTransactions, // New transactions added since the last block was mined.
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash
    };

    // Clear out the new transacitons, as they were added to the above block.
    this.newTransactions = [];

    // Add the new block to our chain.
    this.chain.push( newBlock );

    // Return the newBlock.
    return newBlock;
  }

}
