
 let axios = require("axios");

 describe('Server.submitTransaction', function() {
     let server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
     let axiosMock = sinon.mock(axios);
     StellarSdk.Config.setDefault();
     StellarSdk.Network.useTestNetwork();

     it("multi-sig added succesfully!", function(done) {
        
        var StellarSdk = require('stellar-sdk');
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

        var rootKeypair = StellarSdk.Keypair.fromSecret("SBTOXHURPMET5JNFE5FIJ37G5DQVQBZT3L7YVZ37V5AYSAOBI2EM4EKN");
        var account = new StellarSdk.Account(rootKeypair.publicKey(), "4093915581906960");

        var secondaryAddress = "GAVVPDWP6BXM4WSMVLC7VL46U63FYJF5VEOR7SK5LAJ5ORVB7JFUDPKK";

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

        let blob = encodeURIComponent(transaction.toEnvelope().toXDR().toString("base64"));

        axiosMock.expects('post')
          .withArgs('https://horizon-testnet.stellar.org/transactions', `tx=${blob}`)
          .returns(Promise.resolve({data: {}}));
  
        server.submitTransaction(transaction)
          .then(function() {
            done();
          })
          .catch(function (err) {
            done(err);
          })

     });
 });
