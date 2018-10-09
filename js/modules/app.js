angular.module('starter', [ 'starter.controllers','starter.services','720kb.datepicker']).run(function($rootScope)
{
   const isLogin =  localStorage.getItem("voterId")
        // end of check if loged in )
        if(!localStorage.getItem("voterId"))
$rootScope.notLogin = true;
else
$rootScope.notLogin = false;
});