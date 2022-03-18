// SPDX-License-Identifier: MIT

import "./CrowdFundingTOKEN.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

contract CrowdFunding is Ownable {
    CrowdFundingTOKEN token;
    string name;
    uint256 cantTokenForExchange;
    uint256 cantTokenToTheWinner;
    bool stateCanFund;
    
    constructor() {
        token = new CrowdFundingTOKEN();
        name = "";
        stateCanFund = false;
    }

    function setNameCrowdFunding(string memory _name) public onlyOwner {
        // Verifica que el Nombre no sea nulo
        require(bytes(_name).length > 0);        
        name = _name;        
    }

    function getDataCrowdFunding() public view returns (string memory, uint256,uint256, bool, uint256) {        
        return (name, cantTokenForExchange, cantTokenToTheWinner, stateCanFund, token.totalSupply());
    }

    function totalToken() public view returns (uint256) {
        return token.totalSupply();
    }

    function addToken(uint256 _cantTokenForExchange, 
        uint256 _cantTokenToTheWinner) public onlyOwner {

        // Verifica valores validos
        require(_cantTokenForExchange > 0);
        require(_cantTokenToTheWinner >= 0);

        token.mint(
                msg.sender, 
                _cantTokenForExchange + 
                _cantTokenToTheWinner)
        ;
        cantTokenForExchange = cantTokenForExchange + _cantTokenForExchange;
        cantTokenToTheWinner = cantTokenToTheWinner + _cantTokenToTheWinner;
    }

    function openCrowdFunding() public onlyOwner {
        stateCanFund = true;
    }

    function closeCrowdFunding() public  onlyOwner {
        stateCanFund = false;
    }
}