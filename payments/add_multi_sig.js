
// Add a second signer to the account
// Set our account’s masterkey weight and threshold levels
// Create a multi signature transaction that sends a payment

var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var rootKeypair = StellarSdk.Keypair.fromSecret("SBTOXHURPMET5JNFE5FIJ37G5DQVQBZT3L7YVZ37V5AYSAOBI2EM4EKN");
//var account = new StellarSdk.Account(rootKeypair.publicKey(), "4093915581906960");

var secondaryAddress = "GAVVPDWP6BXM4WSMVLC7VL46U63FYJF5VEOR7SK5LAJ5ORVB7JFUDPKK";

server.loadAccount(rootKeypair.publicKey())
.then(function(account) {
var transaction = new StellarSdk.TransactionBuilder(account)
  .addOperation(StellarSdk.Operation.setOptions({
    signer: {
      ed25519PublicKey: secondaryAddress,
      weight: 1
    }
  }))
  .addOperation(StellarSdk.Operation.setOptions({
    masterWeight: 1, // set master key weight
    lowThreshold: 1,
    medThreshold: 2, // a payment is medium threshold
    highThreshold: 2 // make sure to have enough weight to add up to the high threshold!
  }))
  .build();

// only need to sign with the root signer as the 2nd signer won't be added to the account till after this transaction completes
transaction.sign(rootKeypair); 
   
//Let's see the XDR (encoded in base64) of the transaction we just built
console.log("\nXDR format of transaction: ", transaction.toEnvelope().toXDR('base64'));

//submit transaction
server.submitTransaction(transaction)
.then(function(transactionResult) {
    console.log('\nSuccess! View the transaction at: ');
    //console.log(transactionResult._links.transaction.href);
})
.catch(function(err) {
    console.log('An error has occured:');
    //console.log(err);
 }); 
}); 
 