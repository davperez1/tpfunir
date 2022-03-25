import ContractCrowdFunding from "../../build/contracts/CrowdFunding.json";
// import { parse } from "../../build/contracts/CrowdFunding.json";
// parse = require('../../build/contracts/CrowdFunding.json');
// import { CreateRequire } from "module";
// const require = CreateRequire("../../build/contracts");
// const parse = require("../../build/contracts/CrowdFunding.json");

// const parse = require("../../build/contracts/CrowdFunding.json");
const ABI_CROWDFUNDING = ContractCrowdFunding.abi;


// const ABI_CROWDFUNDING = [
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "previousOwner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "OwnershipTransferred",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "owner",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [],
//       "name": "renounceOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "newOwner",
//           "type": "address"
//         }
//       ],
//       "name": "transferOwnership",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "_name",
//           "type": "string"
//         }
//       ],
//       "name": "setNameCrowdFunding",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "getDataCrowdFunding",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         },
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         },
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [],
//       "name": "totalToken",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function",
//       "constant": true
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "_cantTokenForExchange",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "_cantTokenToTheWinner",
//           "type": "uint256"
//         }
//       ],
//       "name": "addToken",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "openCrowdFunding",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "closeCrowdFunding",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
//   ]
        
        var accounts;
        var cuentaUsuario;
        
        var addressCrowdFunding = "0xFED9682cf4D1aa871deB36f8433367C8D3b38fB6";          
        var instanciaCrowdFundingContract;    

        async function start() {
           window.addEventListener('load', async () => {
                if (window.ethereum) {
                    console.log("Metamask detected!");
                    web3 = new Web3(window.ethereum);
                    await window.ethereum.enable();
                    
                    accounts = await web3.eth.getAccounts();
                    cuentaUsuario = accounts[0];
                    document.getElementById('addressAccountID').innerHTML = cuentaUsuario;
                                
                    instanciaCrowdFundingContract = new web3.eth.Contract(
                      ABI_CROWDFUNDING, addressCrowdFunding);
                    
                      updateDataView();                    
                }
                else{
                    console.log("no se puede conectar a metamask");
                }
           });
        }

      async function updateDataView() {
        var resu = await instanciaCrowdFundingContract.methods.getDataCrowdFunding().call();
        document.getElementById('nombreCrowdFundingID').innerHTML = resu[0];
        document.getElementById('cantTokenForExchangeID').innerHTML = resu[1];
        document.getElementById('cantTokenForToTheWinnerID').innerHTML = resu[2];
        document.getElementById('stateCanFundID').innerHTML = resu[3];
        document.getElementById('cantTotalTokenID').innerHTML = resu[4];
      }
      
      async function guardarNombre() {
        var nombre = document.getElementById('nombreID').value;
        

         await instanciaCrowdFundingContract.methods.setNameCrowdFunding(nombre)
          .send({from: window.cuentaUsuario})
          .once("recepient", (recepient) =>{
	          console.log("success");
          })
          .on("error", () => {
            window.alert("error")
          });
        }

        async function guardarToken() {
          var cantTokenExchangeID = document.getElementById('cantTokenExchangeID').value;
          var cantTokenToTheWinnerID = document.getElementById('cantTokenToTheWinnerID').value;

          await instanciaCrowdFundingContract.methods.addToken(parseInt(cantTokenExchangeID), parseInt(cantTokenToTheWinnerID))
            .send({from: window.cuentaUsuario})
            .once("recepient", (recepient) =>{
	          console.log("success");
          })
          .on("error", () => {
            window.alert("error")
          });

        updateDataView();                    
      }

      async function openCrowdFunding() {
        await instanciaCrowdFundingContract.methods.openCrowdFunding()
          .send({from: window.cuentaUsuario})
          .once("recepient", (recepient) =>{
	          console.log("success");
          })
          .on("error", () => {
            windows.alert("error")
          });
        updateDataView();                    
      }

      async function closeCrowdFunding() {
        await instanciaCrowdFundingContract.methods.closeCrowdFunding()
          .send({from: window.cuentaUsuario})
          .once("recepient", (recepient) =>{
	          console.log("success");
          })
          .on("error", () => {
            windows.alert("error")
          });
        updateDataView();                    
      }


      start(); 