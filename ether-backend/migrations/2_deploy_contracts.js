var EnergyMarket = artifacts.require("./EnergyMarket.sol");

module.exports = function(deployer) {
  deployer.deploy(EnergyMarket);
};
