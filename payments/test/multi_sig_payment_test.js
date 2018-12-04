
 let axios = require("axios");

 describe('Server.submitTransaction', function() {
     let server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
     let axiosMock = sinon.mock(axios);
     StellarSdk.Config.setDefault();
     StellarSdk.Network.useTestNetwork();

     it("multi-sig payment made succesfully!", function(done) {
        
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
 });
