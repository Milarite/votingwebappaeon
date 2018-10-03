var app = angular.module('starter.controllers', []);

app.controller('loginCtrl',function($scope,Web3jsObj){

  

    // login function

$scope.loginBtn=function(_voter){
    const IsVoterExist=smartInstance.checkIdAndPasswordVoter.call(nationalId,password);
    if(IsVoterExist==true){
        localStorage.setItem("voterId",_nationalID);
      }
      return IsVoterExist ;
     
     
    
}

    

});