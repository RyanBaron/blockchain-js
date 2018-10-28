const Blockchain = require( '../blockchain' );

// Create Blockchain.
const blockchain = new Blockchain();

// Create new block.
blockchain.createNewBlock( 12345, 'SLDJFLSJFLSKDJFSLD', 'LKSDJFLASIOWEUWRER');

// Create new transation test.
blockchain.createNewTransaction(100, "ALEXDSFSDFSDFSF", 'JENNJSLFDJLSKDJFSK');
console.info( "Test: Create new transaction", blockchain );
