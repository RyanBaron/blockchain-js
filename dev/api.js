const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const Blockchain = require( './blockchain' );

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
  const blockIndex = blockchain.createNewTransaction( req.body.amount, req.body.sender, req.body.recipient );

  // Return the index of the block the transaction is added to.
  return res.json( { status: true, msg: `Transaction will be added in block: ${blockIndex}.` } );

} );

app.get('/mine', function( req, res ) {

} );

app.listen( 3000, function(){
  console.log( 'Listening on port 3000...' );
} );
