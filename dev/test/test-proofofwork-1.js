const Blockchain = require( '../blockchain' );

// Create Blockchain test.
const blockchain = new Blockchain();

// Define some variables for testing variables.
const previousBlockHash = 'SDKFLSDJFLSDJFLSDJKFLKSAJDFLKASJDFSA';
const currentBlockData = [
  {
    amount: 10,
    sender: 'LINDAJFLSDJA',
    recipient: 'ANDYLSSLSDJF'
  },
  {
    amount: 10,
    sender: 'KATHYJFLSDJF',
    recipient: 'ALISNLSSLSDJF'
  },
  {
    amount: 10,
    sender: 'MIKEJFLSDJF',
    recipient: 'RANDYLSSLSDJF'
  }
];

// Create new block test.
const pow = blockchain.proofOfWork( previousBlockHash, currentBlockData );
console.info( "Test: proofOfWork hash", pow );

// Create new block test.
const hashBlock = blockchain.hashBlock( previousBlockHash, currentBlockData, pow );
console.info( "Test: hashBlock (should start with '0000'): ", hashBlock );
