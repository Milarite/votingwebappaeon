var app=angular.module('starter.services',[]);

app.service("Helper",function(){

    this.ConvertDateToTimeStamp = function (_date){

        var myDate=_date;
        myDate=myDate.split("-");
        var newDate=myDate[1]+"/"+myDate[0]+"/"+myDate[2];
        return new Date(newDate).getTime()

    }

    this.ConvertTimeStampToDate = function (_timeStamp){
        let d =  new Date(_timeStamp * 1000);
        return moment(d).format("MM/DD/YYYY hh:MM:ss");
    }
 this.ConvertTimeStampToTime = function (_date){
     let d = new Date(_date);
        return moment(d).format("hh:MM");
    }
    
    this.SplitTime = function (Period){
 const SplitDash =Period.split("-");
const Split1=SplitDash[1].split(":");
let TimeINt =parseInt(Split1[0]);
return TimeINt;
    }
    this.SplitTimeV2 = function(Period){
     
    const Split1=Period.split(":");
    let TimeINt =parseInt(Split1[0]);
    return TimeINt;
        
    }
     this.TimeFormat = function (date){
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
     }

     this.TimeConvertTo24 = function (_time){
        var time = _time;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return sHours+":"+sMinutes;
     }
    this.ConvertTimeStampTodDateFormat = function (_date){

        const _DateSplited = _date.split("/");
        const date = _DateSplited[1] +"/"+ _DateSplited[0]+"/"+_DateSplited[2];
        let d = new Date(date);
        
           return moment(d).format("MM/DD/YYYY");
       }
       this.ConvertTimeStampTodDateFormatV2 = function (_date){

       
        let d = new Date(_date);
        
           return moment(d).format("MM/DD/YYYY");
       }
    this.formatDate = function (date){
        var d = new Date(date);
        
        month = '' + (d.getMonth() + 1);
        day = '' + d.getDate();

        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day,month,year].join('-');
    }

    this.isFirstDateGreaterThanSecond = function(_date1,_date2){
  
        let firstDate = _date1.split("/");
        let secondDate = _date2.split("/");
        let Date1 = new Date(_date1[1],_date1[0],_date1[2]);
        let Date2 = new Date(_date2[1],_date2[0],_date2[2]);

        return Date1 > Date2;

    }
});
app.service("Web3jsObj",function(){






    web3 = null;
    
    const balancePkAddress = "50FBEE34A355F70931B95C5C114AED5FB21BAF14971C1CDCC067BA46024C7275";
    var abi = null;
    var address = null;
    var accountAddress= null;
    var privateKey = null;

    this.web3Init = function (_address,_abi, _accountAddress,_privateKey){
        abi = _abi;
        address = _address;
        accountAddress = _accountAddress;
        privateKey = _privateKey;
        
    }
  
    this.Web3Facotry=function(url){
        
        if(url)
        {
           web3 =   new Web3(new Web3.providers.HttpProvider(url));
           
        }
        else{
      
           web3=   new Web3(web3.currentProvider);
        }

           return web3;
        
    }





    this.Web3SmartContract=function(){

        if(web3 == null)
        return null;
        ///// else return contract instance;
        const contract =  web3.eth.contract(abi);
        const instance = contract.at(address);






        return instance;
        

    }

    this.web3GetAccountAddress = function(){
        return accountAddress;
    }


    this.prepareRawTransaction=function(_data,_nonce,_value){
        var tx =new ethereumjs.Tx({ 
            data : _data,
            nonce : _nonce,
            gasPrice :web3.toHex(web3.toWei('20', 'gwei')),
            to : address,
            value : _value,
            gasLimit: 1000000

        });

          tx.sign(ethereumjs.Buffer.Buffer.from(privateKey, 'hex'));
          var raw = '0x' + tx.serialize().toString('hex');

          return raw;

    }


    this.createBrainWallet = function (_userName,_password){
      return  ethers.Wallet.fromBrainWallet(_userName,_password);
    }

    this.TransferEther= function(_toAddress,_value,_pk){
        var raw = null;
        var balanceAddress = "0x63a9adabb3edc39f552249cc0dc23eeab0df3c72";
    
        
        return raw;
    }




    



});