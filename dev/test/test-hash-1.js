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
const nonce = 2323423;

// Create new block test.
const hash = blockchain.hashBlock( previousBlockHash, currentBlockData, nonce);
console.info( "Test: Hash block", hash );
