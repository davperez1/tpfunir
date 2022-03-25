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
    document.getElementById('nombreCrowdFundingID').innerHTML = resu[0];
    document.getElementById('cantTokenForExchangeID').innerHTML = resu[1];
    document.getElementById('cantTokenForToTheWinnerID').innerHTML = resu[2];
    document.getElementById('stateCanFundID').innerHTML = resu[3];
    document.getElementById('cantTotalTokenID').innerHTML = resu[4];
  },

  updateViewUser: async function() {      
    var bal = await this.web3.eth.getBalance(this.userAccount);
    document.getElementById('addressAccountID-user').innerHTML = this.userAccount;
    document.getElementById('cantETHID-user').innerHTML = this.web3.utils.fromWei(bal);
    document.getElementById('cantCFTID-user').innerHTML = 0 ;
    document.getElementById('cantNumeroCompradosID-user').innerHTML = 0 ;
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

  App.start();
});

// var accounts;
// var cuentaUsuario;

// async function start() {
//     window.addEventListener('load', async () => {
//         if (window.ethereum) {
//             console.log("Metamask detected!");
//             web3 = new Web3(window.ethereum);
//             await window.ethereum.enable();
            
//             accounts = await web3.eth.getAccounts();
//             cuentaUsuario = accounts[0];
//             document.getElementById('addressAccountID').innerHTML = cuentaUsuario;
                                            
//             // instanciaCrowdFundingContract = new web3.eth.Contract(
//             //   ABI_CROWDFUNDING, addressCrowdFunding);
            
//             updateDataView();
//         }
//         else{
//             console.log("no se puede conectar a metamask");
//         }
//     });
// }

// async function updateDataView(){
//     var bal = await web3.eth.getBalance(accounts[0]);
//     document.getElementById('cantETHID').innerHTML = web3.utils.fromWei(bal);
//     document.getElementById('cantCFTID').innerHTML = 0 ;
//     document.getElementById('cantNumeroCompradosID').innerHTML = 0 ;
//     }

// start(); 