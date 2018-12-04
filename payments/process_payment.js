
        var StellarSdk = require('stellar-sdk');
  
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        
         var sourceSecretKey = 'SBIPSWXLUZGKNPLBIFRXHSY67U763SIMUP42MQHD2AXLMCB67F3YGWOY';
            var sourceKeys = StellarSdk.Keypair.fromSecret(sourceSecretKey);
            var sourcePublicKey = sourceKeys.publicKey();
        
        
        var destinationId = 'GDV6RUDZOJAY6ZDAPJMDMGZQ4FTZNCEMR27XZKSM4BL7ECF47KP3APPV';
        
            /* Initiate payment from acc A to acc B */
            server.loadAccount(sourcePublicKey)
            .then(function(account) {
                const transaction = new StellarSdk.TransactionBuilder(account)
                .addOperation(StellarSdk.Operation.payment({
                    destination: destinationId,
                    asset: StellarSdk.Asset.native(),
                    amount: '50.0000001'
                }))
                .build();
            
                transaction.sign(sourceKeys);
            
                // Let's see the XDR (encoded in base64) of the transaction we just built
                console.log("\nXDR format of transaction: ", transaction.toEnvelope().toXDR('base64'));
            
                // Submit the transaction to the Horizon server. The Horizon server will then
                // submit the transaction into the network for us.
                server.submitTransaction(transaction)
                .then(function(transactionResult) {
                    //console.log(JSON.stringify(transactionResult, null, 2));
                    console.log('\nSuccess! View the transaction at: ');
                    console.log(transactionResult._links.transaction.href);
                })
                .catch(function(err) {
                    console.log('An error has occured:');
                    console.log(err);
                }); 
            });
   
   
