const EnergyTrade = artifacts.require("Energy.sol");

module.exports = function(deployer) {
  deployer.deploy(EnergyTrade);
};