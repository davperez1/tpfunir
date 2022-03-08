// SPDX License Identifier: MIT
pragma solidity ^0.5.1;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/CrowdFunding.sol";

contract TestCrowdFunding {

    // Solo el propietario puede crearlo
    function testSettingAnOwnerDuringCreation() public {
        CrowdFunding crowdFunding = new CrowdFunding();
        
        address expected = address(crowdFunding.owner());
        address thisaddress = address(this);

        Assert.equal(expected, thisaddress, "ALERT owner is differente than a deployer");
    }

   //Solo el propietario puede desplegar el contrato
   function testSettingAnOwnerOfDeployedContract() public {
        CrowdFunding crowdFunding = CrowdFunding(DeployedAddresses.CrowdFunding());
                
        Assert.equal(address(crowdFunding.owner()), msg.sender, "ALERT owner is differente than a deployer");
   }  
}