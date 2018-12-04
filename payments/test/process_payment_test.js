
 let axios = require("axios");

 describe('Server.submitTransaction', function() {
     let server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
     let axiosMock = sinon.mock(axios);
     StellarSdk.Config.setDefault();
     StellarSdk.Network.useTestNetwork();

     it("payment made succesfully!", function(done) {

       var sourceSecretKey = 'SBIPSWXLUZGKNPLBIFRXHSY67U763SIMUP42MQHD2AXLMCB67F3YGWOY';
       let keypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
       var sourcePublicKey = keypair.publicKey();

       server.loadAccount(sourcePublicKey)
         .then(function(account) {
       let transaction = new StellarSdk.TransactionBuilder(account)
         .addOperation(StellarSdk.Operation.payment({
           destination: "GDV6RUDZOJAY6ZDAPJMDMGZQ4FTZNCEMR27XZKSM4BL7ECF47KP3APPV",
           asset: StellarSdk.Asset.native(),
           amount: '30.0000001'
         }))
         .build();
       transaction.sign(keypair);
 
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
