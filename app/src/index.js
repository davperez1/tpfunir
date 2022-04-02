import Web3 from "web3";
import CrowdFundingArtifact from "../../build/contracts/CrowdFunding.json";

const App = {
  web3: null,
  userAccount: null,
  crowdFundingContract: null,

  start: async function() {
    const { web3 } = this;

    try {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CrowdFundingArtifact.networks[networkId];
      this.crowdFundingContract = new web3.eth.Contract(
        CrowdFundingArtifact.abi,
        deployedNetwork.address,
      );

      const accounts = await web3.eth.getAccounts();
      this.userAccount = accounts[0];

      document.getElementById('addressAccountID').innerHTML = this.userAccount;
      this.updateDataView();
      this.updateViewUser();  

    } catch (error) {
      console.log(error);
      console.error("No se puede conectar al SmartContract o Blockchain");
    }
  },

  guardarNombre: async function () {
    var nombre = document.getElementById('nombreID').value;  

    await this.crowdFundingContract.methods.setNameCrowdFunding(nombre)
    .send({from: this.userAccount})
    .once("recepient", (recepient) =>{
      console.log("success");
    })
    .on("error", () => {
      window.alert("error")
    });

    App.updateDataView();       
  },

  updateDataView: async function() {
    var resu = await this.crowdFundingContract.methods.getDataCrowdFunding().call();
    var totalETH = await this.crowdFundingContract.methods.getBalanceCrowdFundingETH().call();
    document.getElementById('nombreCrowdFundingID').innerHTML = resu[0];
    document.getElementById('cantTokenForExchangeID').innerHTML = resu[1];
    document.getElementById('cantTokenForToTheWinnerID').innerHTML = resu[2];
    document.getElementById('stateCanFundID').innerHTML = resu[3];
    document.getElementById('cantTotalTokenID').innerHTML = resu[4];
    document.getElementById('totalETHID').innerHTML = this.web3.utils.fromWei(totalETH);

  },

  guardarToken: async function() {
    var cantTokenExchangeID = document.getElementById('cantTokenExchangeID').value;
    var cantTokenToTheWinnerID = document.getElementById('cantTokenToTheWinnerID').value;

    await this.crowdFundingContract.methods.addToken(parseInt(cantTokenExchangeID), parseInt(cantTokenToTheWinnerID))
      .send({from: this.userAccount})
      .once("recepient", (recepient) =>{
      console.log("success");
    })
    .on("error", () => {
      window.alert("error")
    });

    App.updateDataView();   
  },

  openCrowdFunding: async function() {
    await this.crowdFundingContract.methods.openCrowdFunding()
    .send({from: this.userAccount})
    .once("recepient", (recepient) =>{
      console.log("success");
    })
    .on("error", () => {
      windows.alert("error")
    });
  App.updateDataView();   
  },

  closeCrowdFunding: async function() {
    await this.crowdFundingContract.methods.closeCrowdFunding()
    .send({from: this.userAccount})
    .once("recepient", (recepient) =>{
      console.log("success");
    })
    .on("error", () => {
      windows.alert("error")
    }); 
  
    App.updateDataView();  
  },

  updateViewUser: async function() {      

    var priceTokenCFT = await this.crowdFundingContract.methods.getPriceTokenCFT().call();
    var priceTicketLottery = await this.crowdFundingContract.methods.getPriceTicketLottery().call();

    var balanceETHAccount = await this.web3.eth.getBalance(this.userAccount);
    var balanceCFTAccount = await this.crowdFundingContract.methods.getBalanceCFT(this.userAccount).call();
    var cantTicketLotteryBuy = await this.crowdFundingContract.methods.getCantTicketLotteryFromAccount(
      this.userAccount).call();
    var numberAssignedTicketLottery = await this.crowdFundingContract.methods.getListNumberTicketAssigned(
      this.userAccount).call();    
    
    document.getElementById('priceTokenCFTID').innerHTML = this.web3.utils.fromWei(String(priceTokenCFT));
    document.getElementById('priceTicketLotteryID').innerHTML = priceTicketLottery;

    document.getElementById('addressAccountID-user').innerHTML = this.userAccount;
    document.getElementById('cantETHID-user').innerHTML = this.web3.utils.fromWei(String(balanceETHAccount));
    document.getElementById('cantCFTCompradoID-user').innerHTML = balanceCFTAccount ;
    document.getElementById('cantTicketLotteryCompradosID-user').innerHTML = cantTicketLotteryBuy ;

    console.log(cantTicketLotteryBuy);
    
    document.getElementById('numberTicketAsignedID-user').innerHTML = numberAssignedTicketLottery;
    console.log(numberAssignedTicketLottery);
    console.log(+numberAssignedTicketLottery);


  },

  buyTokenCFT: async function(){
    var tokenToBuy = 1;
    var ethForPay = 1;
    // Fix for buy more token

    await this.crowdFundingContract.methods.buyToken(this.userAccount, parseInt(tokenToBuy))
      .send({from: this.userAccount, value: this.web3.utils.toWei( String(ethForPay), 'ether')})
      .once("recepient", (recepient) =>{
      console.log("success");
    })
    .on("error", () => {
      window.alert("error")
    });

    App.updateViewUser();
  },

  buyTicketLottery: async function(){
    await this.crowdFundingContract.methods.buyTicketLottery()
      .send({from: this.userAccount})
      .once("recepient", (recepient) =>{
      console.log("success");
    })
    .on("error", () => {
      window.alert("error")
    });

    App.updateViewUser();
  }


};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  // Event when change account in Metamask
  ethereum.on('accountsChanged', function (accounts) {
    App.start();
  })

  App.start();
});