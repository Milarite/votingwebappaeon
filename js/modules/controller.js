var app = angular.module('starter.controllers', []);

app.controller('loginCtrl',function($scope,Web3jsObj){

  

    // login function

$scope.loginBtn=function(_voter){
    
}

    

});

app.controller("signupCtrl",function($scope,Web3jsObj){
    Web3jsObj.web3Init(contractsInfo.main,MainAbi,public_key,private_key);
    Web3jsObj.Web3Facotry(rinkebyUrl);
    const smartContract = Web3jsObj.Web3SmartContract();
    $scope.isVoterExistCheck = false;
    $scope.NationalIdValidation= function(_nationalId){
        if(_nationalId){
        let isVoterExist = smartContract.checkNationalIDVoter.call(_nationalId);
        $scope.isVoterExistCheck = isVoterExist;
       return isVoterExist;
        }
        return false;
    }
/// add Ether 
$scope.addEther = function(_from,_fromPk,_to){
        
    var balance = web3.eth.getBalance(_to);
    balance = web3.toDecimal(balance);
    balance = web3.fromWei(balance, 'ether');
  
    if(balance < 0.5)
   { 
    web3.eth.getTransactionCount(_from,function(err,transactionCount){

        var tx =new ethereumjs.Tx({ 
       data : '',
       nonce : transactionCount,
       gasPrice :web3.toHex(web3.toWei('20', 'gwei')),
       to : _to,
       value : 500000000000000000 ,
       gasLimit: 1000000
       

   });

     tx.sign(ethereumjs.Buffer.Buffer.from(_fromPk.substr(2), 'hex'));
     var raw = '0x' + tx.serialize().toString('hex');
     web3.eth.sendRawTransaction(raw, function(err,result){
        
        if(!err){
            alert("voter created");    $.LoadingOverlay('hide');
            location.reload();
            
        }

     });
    
     
})

}
else{
    alert("voter created");    $.LoadingOverlay('hide');
    location.reload();
}

}
// end Of Add Ether

$scope.SignUpBtn=function(_voter){
    
    $.LoadingOverlay('show');
    /// create wallet for voter
    Web3jsObj.createBrainWallet(_voter.nationalityID, _voter.password).then(function(_wallet){
                
                          
        localStorage.setItem("vaddress", _wallet.address);
        localStorage.setItem("vpkaddresss",_wallet.privateKey);
        

        //$scope.addEtherToJudgment(public_key,private_key,_wallet.address);
    
        ///get data for signupvoter method
        var data =smartContract.signUpVoter.getData(_wallet.address,_wallet.privateKey,_voter.nationalityID,_voter.password
            ,_voter.name,_voter.birthOfDate,_voter.city,_voter.year); 

            web3.eth.getTransactionCount(public_key,function(err,nonce){
                var tx =new ethereumjs.Tx({ 
                    data : data,
                    nonce : nonce,
                    gasPrice :web3.toHex(web3.toWei('20', 'gwei')),
                    to : contractsInfo.main,
                    value : 0,
                    gasLimit: 1000000
                    
        
                });
        
                  tx.sign(ethereumjs.Buffer.Buffer.from(private_key.substr(2), 'hex'));
                  var raw = '0x' + tx.serialize().toString('hex');

                  web3.eth.sendRawTransaction(raw, function (err, transactionHash) {

                    if(!err)
                    {
                    
                    console.log(transactionHash);
                    (async function() {
                        const minedTxReceipt = await awaitTx(web3, transactionHash);
                      $scope.addEther(public_key,private_key,_wallet.address)
                      })();
                    }else{
                    console.log(err);
                    $.LoadingOverlay('hide');
                    }
                    
                    
                        });
            });

    });
    //// register voter
  
}

});