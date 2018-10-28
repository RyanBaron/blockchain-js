const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const uuid = require( 'uuid/v1');
const requestPromise = require( 'request-promise');

const port = process.argv[2];
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

// Regiser a node and broadcast it to the network.
app.post( '/register-and-broadcast-node', function( req, res ) {
  const newNodeUrl = req.body.newNodeUrl;

  // Only push the newNodeUrl to the newtworkNodes if is NOT already an existing node url.
  if ( blockchain.networkNodes.indexOf( newNodeUrl ) == -1 ) {
    blockchain.networkNodes.push( newNodeUrl );
  }

  // Loop through all of the network nodes.
  // - requestOptions to make a request to each network node at '/register-node'.
  // - Store the promises in an array of promises.
  // - Registering the new networkNodeUrl with each exisitng node.
  const registerNodesPromises = [];
  blockchain.networkNodes.forEach( networkNodeUrl => {
    const requestOptions = {
      uri: networkNodeUrl + '/register-node',
      method: 'POST',
      body: { newNodeUrl: newNodeUrl },
      json: true
    };

    // Store in our promise array
    registerNodesPromises.push( requestPromise( requestOptions ) );
  } );

  // Run all of the promises inisde registerNodesPromises.
  // - Essentially broadcasting the new node to all exisiting nodes in the network.
  Promise.all( registerNodesPromises )
    .then( data => {
      // All of the promises in registerNodesPromises have been finished.

      const bulkRegisterOptions = {
        uri: newNodeUrl + '/register-nodes-bulk',
        method: 'POST',
        body: { allNetworkNodes: [ ...blockchain.networkNodes, blockchain.currentNodeUrl ] }, // using the '...' spread operator because blockchain.networkNodes is an array
        json: true
      };

      return requestPromise( bulkRegisterOptions );
    } )
    .then( data => {
      res.json( {
        status: true,
        msg: "New node registered with the network successfully.",
      } );
    } );

} );

// Register a node with the network.
// - Used to register a new node that was broadcasted to the network, but NOT rebroadcast it.
app.post( '/register-node', function( req, res ) {
  const newNodeUrl = req.body.newNodeUrl;


  const nodeNotAlreadyPresent = blockchain.networkNodes.indexOf( newNodeUrl )  == -1; // Check if newNodeUrl already exists in the networkNodes array.
  const notCurrentNode = blockchain.currentNodeUrl !== newNodeUrl; // Check if newNodeUrl is the current url we are on.
  if ( nodeNotAlreadyPresent  && notCurrentNode ) {
    blockchain.networkNodes.push( newNodeUrl );
  }

  res.json( {
    status: true,
    msg: "New node registered successfully.",
  } );

} );

// Register multiple nodes at once.
app.post( '/register-nodes-bulk', function( req, res ) {
  const allNetworkNodes = req.body.allNetworkNodes; // An array of all of networkNodeUrls on the network.

  allNetworkNodes.forEach( networkNodeUrl => {

    const nodeNotAlreadyPresent = blockchain.networkNodes.indexOf( networkNodeUrl ) == -1; // Check if newNodeUrl already exists in the networkNodes array.
    const notCurrentNode = blockchain.currentNodeUrl!== networkNodeUrl; // Check if newNodeUrl is the current url we are on.

    // if the networkNodeUrl is not already in the networkNodes array &&
    // if the networkNodeUrl is not the current node.
    // -- Then add it to the networkNodes array.
    if ( nodeNotAlreadyPresent && notCurrentNode ) {
      blockchain.networkNodes.push( networkNodeUrl );
    }

  } );

  res.json( {
    status: true,
    msg: "Bulk registration successful.",
  } );

} );


// Start the server.
app.listen( port, function(){
  console.log( `Listening on port ${port}.` );
} );
