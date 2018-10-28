const Blockchain = require( '../blockchain' );

// Create Blockchain.
const blockchain = new Blockchain();

// Create new block.
blockchain.createNewBlock( 12345, 'SLDJFLSJFLSKDJFSLD', 'LKSDJFLASIOWEUWRER');

// Create A new transation.
blockchain.createNewTransaction(100, "ALEXDSFSDFSDFSF", 'JENNJSLFDJLSKDJFSK');

// Create a new block after a transaction has been created above. (essentiall mine it).
blockchain.createNewBlock( 32311, 'SDFSDFSDFASWESDFSS', 'SDSDFSDFASSADFASSD');
console.info( "Test: Create new block after a transaction (mine)", blockchain );

// Create 2 additional transactions
blockchain.createNewTransaction(1000, "JOEDSFSDFSDFSF", 'TIMJSLFDJLSKDJFSK');
blockchain.createNewTransaction(7, "KATIEDSFSDFSDFSF", 'ALISONSLFDJLSKDJFSK');

// Create a new block after a transaction has been created above. (essentiall mine it).
blockchain.createNewBlock( 32311, 'TRRTYRTYRTDSDFSDF', 'SDFSDFSDFASWESDFSS');
console.info( "Test: Create new block after 2 more transactions (mine)", blockchain );
