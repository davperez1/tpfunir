// SPDX-License-Identifier: MIT

import "./CrowdFundingTOKEN.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.0;

contract CrowdFunding is Ownable {
    CrowdFundingTOKEN token;
    
    constructor() {
        token = new CrowdFundingTOKEN();
    }

    function totalToken() public view returns (uint256) {
        return token.totalSupply();
    }

    function addToken(uint256 _addToken) public onlyOwner {
        token.mint(msg.sender, _addToken);
    }
}