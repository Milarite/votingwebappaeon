var app = angular.module('starter.controllers', []);

app.controller('loginCtrl',function($scope,Web3jsObj,$window){

    // check if voter already loged in

    const nationalId = localStorage.getItem("vaddress");
    if(nationalId){
        $window.location.href="/index.html"
    }
  
    Web3jsObj.web3Init(contractsInfo.main,MainAbi,public_key,private_key);
    Web3jsObj.Web3Facotry(rinkebyUrl);
    const smartInstance = Web3jsObj.Web3SmartContract();
    // login function

$scope.loginBtn=function(_voter){
    const IsVoterExist=smartInstance.checkIdAndPasswordVoter.call(_voter.nationalId,_voter.password);
    if(IsVoterExist != no_address){
        localStorage.setItem("voterId",_voter.nationalId);
        localStorage.setItem("vaddress",IsVoterExist);
        $window.location.href="/index.html";
        
      }
      else{
          alert("voter not found");
      }
     
     
    
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


app.controller("indexCtrl",function($scope,Web3jsObj)

{

    Web3jsObj.web3Init(contractsInfo.main,MainAbi,public_key,private_key);
    Web3jsObj.Web3Facotry(rinkebyUrl);
    const smartContract = Web3jsObj.Web3SmartContract();
    const voter_address = localStorage.getItem("vaddress");
$scope.fetchCandidate = function(){
    const numberOfCandidate = smartContract.getCandidateNationalIDArrayLength.call();
    const candidatesNo = parseInt(JSON.parse(numberOfCandidate));
    const getCurrentVoterCity = smartContract.getVoterCity.call(voter_address);
    var items = [];
for(var i =0 ; i < candidatesNo ;i++)
{
debugger;
  var address = smartContract.getCandidateNationalID.call(i);
  var name = smartContract.getCandidateName.call(address);
  if(name)
  {
  var city = smartContract.getCandidateCity.call(address);
  var _nationalId = smartContract.getCandidateNational.call(address);
  var Campaign = smartContract.getCandidateCampaign.call(address);
  if(city == getCurrentVoterCity){
    var candidate = {nameCandidate : name , city :city ,Campaign : Campaign ,nationalId : _nationalId };
    items.push(candidate);
  }
  
  }
}
app.controller("HistoryCtrl",function($scope,Web3jsObj)
{
    Web3jsObj.web3Init(contractsInfo.main,MainAbi,public_key,private_key);
    Web3jsObj.Web3Facotry(rinkebyUrl);
    const smartContract = Web3jsObj.Web3SmartContract();
    const voter_address = localStorage.getItem("vaddress");
    var candidateName=smartContract.getCandidateName.call(address);

}

$scope.candidates= items;
}
$scope.fetchCandidate();


});