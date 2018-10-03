var app=angular.module('starter.services',[]);
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