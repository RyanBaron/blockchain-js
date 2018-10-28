const Blockchain = require( '../blockchain' );

// Create Blockchain test.
const blockchain = new Blockchain();
console.info( "Test: Create blockchain", blockchain );

// Create new block test.
blockchain.createNewBlock( 12345, 'SLDJFLSJFLSKDJFSLD', 'LKSDJFLASIOWEUWRER');
console.info( "Test: Create new block", blockchain );
