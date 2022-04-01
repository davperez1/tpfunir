// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CrowdFundingTOKEN is ERC20, Ownable {
    constructor () ERC20("CrowdFunding","CFT"){
        _mint(msg.sender,0 * 10 ** 0);
    }

    // Funcion para que el Propietario pueda minar mas tokens
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);

    }

    function transferCFT(address sender, address receiver, uint256 numTokens) public returns (bool){
        _transfer(sender, receiver, numTokens);        
        return true;
    } 
}