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


app.controller("indexCtrl",function($scope,Web3jsObj,Helper)

{
///// important
    Web3jsObj.web3Init(contractsInfo.main,MainAbi,public_key,private_key);
    Web3jsObj.Web3Facotry(rinkebyUrl);
    const smartContract = Web3jsObj.Web3SmartContract();
    const voter_address = localStorage.getItem("vaddress");

    /// end of important
/// get settings 

const TodayDate=smartContract.getCurrentTime.call();
const Period=smartContract.getPeriod.call();
const StartDate=smartContract.getStartDate.call();
const timeStampToDate=Helper.ConvertTimeStampToDate(TodayDate);

// end of get settings
$scope.fetchCandidate = function(){
    const numberOfCandidate = smartContract.getCandidateNationalIDArrayLength.call();
    const candidatesNo = parseInt(JSON.parse(numberOfCandidate));
    const getCurrentVoterCity = smartContract.getVoterCity.call(voter_address);
    var items = [];
for(var i =0 ; i < candidatesNo ;i++)
{
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
  $scope.candidates= items;
 
}



}
$scope.fetchCandidate();


$scope.CheckDate=function(){
    var time2 =new Date(timeStampToDate);
    //time2.add ({hours: 2 }) ;
   
   
   
   let timeStampToTime=Helper.TimeFormat(time2);
   
   
   
   const DateFormat = Helper.ConvertTimeStampTodDateFormatV2(timeStampToDate);
   
   const StartDateFormat = Helper.ConvertTimeStampTodDateFormat(StartDate);
   
   const DateNow = new Date(DateFormat);
   const DateStartDate = new Date(StartDateFormat);
   let TimeINt = Helper.SplitTime(Period);
   
   
    let splitedTime = Helper.SplitTimeV2(timeStampToTime);

    if(TodayDate && timeStampToDate && StartDate && Period)
    {
    if (DateStartDate < DateNow  
        || (Helper.ConvertTimeStampTodDateFormatV2(DateStartDate) == Helper.ConvertTimeStampTodDateFormatV2(DateNow) && (TimeINt<splitedTime) ))
     {
       
        return false;
          
     }
    }
    
    return true;

}

$scope.grantVote = function (_candidateNationalId){

 
if($scope.CheckDate())
{

    /// check if voted

    const isVoted = smartContract.checkIfVoted.call(voter_address,_candidateNationalId);

    if(isVoted == "Done")
    {


    // end of check if voted

    // call smart contract function by send transaction
/// send transaction
  const data =   smartContract.grantYourVote.getData(voter_address,_candidateNationalId);

  web3.eth.getTransactionCount(voter_address,function(err,nonce){
    $.LoadingOverlay('show');    
    var transactionRaw =new ethereumjs.Tx({ 
        data : data,
        nonce : nonce,
        gasPrice :web3.toHex(web3.toWei('20', 'gwei')),
        to : contractsInfo.main,
        value : 0,
        gasLimit: 1000000
        

    });
    const vpk = smartContract.getPrivateKey.call(voter_address);
    transactionRaw.sign(ethereumjs.Buffer.Buffer.from(vpk.substr(2), 'hex'));
    var rawGrantVoteTransaction = '0x' + transactionRaw.serialize().toString('hex');

    web3.eth.sendRawTransaction(rawGrantVoteTransaction, function (err, grantVoteTransactionHash) {
        console.log("errz",err);
////save hash to voter address

  (async function() {
      
                const minedTxReceipt = await awaitTx(web3, grantVoteTransactionHash);
                
            
        const hashVoterData =   smartContract.addTxtHashVoter.getData(voter_address,grantVoteTransactionHash,_candidateNationalId);

        web3.eth.getTransactionCount(public_key,function(err,nonce){
                        
          var transactionRawHashVoter =new ethereumjs.Tx({ 
              data : hashVoterData,
              nonce : nonce,
              gasPrice :web3.toHex(web3.toWei('20', 'gwei')),
              to : contractsInfo.main,
              value : 0,
              gasLimit: 1000000
              
      
          });
          transactionRawHashVoter.sign(ethereumjs.Buffer.Buffer.from(private_key.substr(2), 'hex'));
          var rawHashVoterTransaction = '0x' + transactionRawHashVoter.serialize().toString('hex');

          web3.eth.sendRawTransaction(rawHashVoterTransaction, function (err, hashVoterTransactionHash) {
              console.log("errs",err);
            (async function() {
                const minedTxReceipt = await awaitTx(web3, hashVoterTransactionHash);

            const hashCandidateData =   smartContract.addTxtHashToCandidate.getData(_candidateNationalId,grantVoteTransactionHash);


   web3.eth.getTransactionCount(public_key,function(err,nonce){
                        
          var transactionRawCandidateHash =new ethereumjs.Tx({ 
              data : hashCandidateData,
              nonce : nonce,
              gasPrice :web3.toHex(web3.toWei('20', 'gwei')),
              to : contractsInfo.main,
              value : 0,
              gasLimit: 1000000
              
      
          });


          transactionRawCandidateHash.sign(ethereumjs.Buffer.Buffer.from(private_key.substr(2), 'hex'));
          var rawHashCandidatTransaction = '0x' + transactionRawCandidateHash.serialize().toString('hex');
          web3.eth.sendRawTransaction(rawHashCandidatTransaction, function (err, candidateHashTransaction) {

            (async function() {
                const minedTxReceipt = await awaitTx(web3, candidateHashTransaction);
if(!err){
    alert("Done");
}

                



 })();


          });








          });

        })();

    });

    });

/// end of send transaction

  })();




        



    });

});
    }
    else{
        alert("You already voted to this candidate");
    }

}else{
    alert("out of date");
}

    


}



  



});




app.controller("HistoryCtrl",function($scope,Web3jsObj)
{
    Web3jsObj.web3Init(contractsInfo.main,MainAbi,public_key,private_key);
    Web3jsObj.Web3Facotry(rinkebyUrl);
    const smartContract = Web3jsObj.Web3SmartContract();
    const voter_address = localStorage.getItem("vaddress");
   
    const myVotesLength=smartContract.getNationalIDArrayLength.call(voter_address);
    var array=[];
    for(var i =0;i<myVotesLength;i++)
    {
        var address = smartContract.getCandidateNationalID.call(i);
        const name=smartContract.getCandidateName.call(address);
        var city=smartContract.getCandidateCity.call(address);
        const candidateAddress=smartContract.getVotedCandidatesAddress.call(voter_address,i);
        const Campaign=smartContract.getCandidateCampaign.call(address);
        console.log("candidate Adderess",candidateAddress);
        var candidateInfo={name : name , city :city ,Campaign : Campaign  };
        array.push (candidateInfo);
      
    }
   
    $scope.candidates= array;
    // alert(myVotesLength);
     



});





