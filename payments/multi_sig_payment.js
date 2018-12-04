
// Add a second signer to the account
// Set our account’s masterkey weight and threshold levels
// Create a multi signature transaction that sends a payment

var StellarSdk = require('stellar-sdk');
StellarSdk.Network.useTestNetwork();
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var rootKeypair = StellarSdk.Keypair.fromSecret("SBTOXHURPMET5JNFE5FIJ37G5DQVQBZT3L7YVZ37V5AYSAOBI2EM4EKN");
//var account = new StellarSdk.Account(rootKeypair.publicKey(), "4093915581906960");
 
// now create a payment with the account that has two signers
server.loadAccount(rootKeypair.publicKey())
.then(function(account) {
var transaction = new StellarSdk.TransactionBuilder(account)
    .addOperation(StellarSdk.Operation.payment({
        destination: "GDV6RUDZOJAY6ZDAPJMDMGZQ4FTZNCEMR27XZKSM4BL7ECF47KP3APPV",
        asset: StellarSdk.Asset.native(),
        amount: "101.0000001" // 101 XLM
    }))
    .build();

    var secondKeypair = StellarSdk.Keypair.fromSecret("SBIPSWXLUZGKNPLBIFRXHSY67U763SIMUP42MQHD2AXLMCB67F3YGWOY");

    // now we need to sign the transaction with both the root and the secondaryAddress
    transaction.sign(rootKeypair);
    transaction.sign(secondKeypair);

    // Let's see the XDR (encoded in base64) of the transaction we just built
    console.log("\nXDR format of transaction: ", transaction.toEnvelope().toXDR('base64'));

    //submit transaction
    server.submitTransaction(transaction)
    .then(function(transactionResult) {
        console.log('\nSuccess! View the transactionTransfer at: ');
        console.log(transactionResult._links.transaction.href);
    })
    .catch(function(err) {
        console.log('An error has occured:');
        console.log(err);
    }); 
}); 