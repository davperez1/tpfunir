// SPDX License Identifier: MIT
pragma solidity ^0.5.1;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CrowdFunding.sol";

contract TestCrowdFunding {
    function testSettingAnOwnerCreation() public {
        CrowdFunding crowdFunding = new CrowdFunding();
        
        address expected = address(crowdFunding.owner());
        address thisaddress = address(this);

        Assert.equal(expected, thisaddress, "ALERT owner is differente than a deployer");
    }
}