// SPDX-License-Identifier: MIT

import "./CrowdFundingTOKEN.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

contract CrowdFunding is Ownable {
    CrowdFundingTOKEN token;
    string name;
    uint256 cantTokenForExchange;
    uint256 cantTokenToTheWinner;
    
    constructor() {
        token = new CrowdFundingTOKEN();
    }

    function setDataCrowdFunding(string memory _name) public {
        name = _name;
    }

    function getDataCrowdFunding() public view returns (string memory, uint256,uint256) {        
        return (name, cantTokenForExchange, cantTokenToTheWinner);
    }

    function totalToken() public view returns (uint256) {
        return token.totalSupply();
    }

    function addToken(uint256 _cantTokenForExchange, 
        uint256 _cantTokenToTheWinner) public onlyOwner {
        token.mint(
                msg.sender, 
                _cantTokenForExchange + 
                _cantTokenToTheWinner);
    }
}