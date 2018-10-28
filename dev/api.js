const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const uuid = require( 'uuid/v1');

const Blockchain = require( './blockchain' );
const configBlockchain = require( './config.blockchain' );

const nodeAddress = uuid().split('-').join(''); // Generate a uuid, and remove any '-' and replace with '';
const blockchain = new Blockchain(); // Make an instance of Blockchain.
const app = express();

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) ) ;

app.get('/blockchain', function( req, res ) {

  // Return our blcokchain instance.
  res.send( blockchain );

} );

app.post('/transaction', function( req, res ) {

  // Create a new transaction with the request data.
  const blockIndex = blockchain.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  // Return the index of the block the transaction is added to.
  return res.json( {
    status: true,
    msg: `Transaction will be added in block: ${blockIndex}.`
  } );
} );

app.get('/mine', function( req, res ) {

  const lastBlock = blockchain.getLastBlock(); // Get the last block from the chain.
  const previousBlockHash = lastBlock['hash']; // Get the last block hash from the last block.

  // Create currentBlockData as an object for the new block.
  const currentBlockData = {
    transactions: blockchain.pendingTransactions,
    index: lastBlock['index'] + 1
  }

  // Get the nonce value four the new block.
  const nonce = blockchain.proofOfWork(
    previousBlockHash,
    currentBlockData
  );

  // Get the has value for the new block.
  const blockHash = blockchain.hashBlock(
    previousBlockHash,
    currentBlockData,
    nonce
  );

  // When a block is successfully mined, send the miner a small reward.
  blockchain.createNewTransaction(
    configBlockchain.mine.reward,
    configBlockchain.mine.senderAddress,
    nodeAddress
  );

  // Create a newBlock with the block data from above.
  const newBlock = blockchain.createNewBlock(
    nonce,
    previousBlockHash,
    blockHash
  );

  res.json( {
    status: true,
    msg: "New block minded successfully",
    data: {
      block: newBlock
    }
  })

} );

app.listen( 3000, function(){
  console.log( 'Listening on port 3000...' );
} );
