const ConvertLib = artifacts.require("ConvertLib");
const CrowFunding = artifacts.require("CrowdFunding");
const CrowFundingTOKEN = artifacts.require("CrowdFundingTOKEN");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, CrowFunding);
  deployer.link(ConvertLib, CrowFundingTOKEN);
  deployer.deploy(CrowFunding);
  deployer.deploy(CrowFundingTOKEN);

};