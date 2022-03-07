// SPDX License Identifier: MIT
pragma solidity ^0.5.1;

contract CrowdFunding {
    address public owner;
    
    constructor() public {
        owner = msg.sender;
    }
}