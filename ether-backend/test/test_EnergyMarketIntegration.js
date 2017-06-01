var EnergyMarket = artifacts.require("./EnergyMarket.sol");

contract('EnergyMarket', function(accounts) {
    let market;
    const storedEnergy = 50;
    const storedEnergyINVALID = 200;
    const owner = accounts[0];
    const consumer = accounts[1];
    const producer = accounts[2];

  it("Add participants and exec transfer should pass with under 100 units", function() {
    return EnergyMarket.new().then(function(_market) {
        market = _market;
      return market.addParticipant();

    }).then(function() {
        return market.addParticipant();

    }).then(function() {
        return market.addStoredEnergy(producer, storedEnergy);

    }).then(function() {
        return market.depositEnergyTokens(consumer, storedEnergy);

    }).then(function() {
        return market.tokenBalance.call(consumer);

    }).then(function(balance) {
        return market.transferEnergy(producer, consumer, storedEnergy);

    }).then(function(tx) {
        console.log(tx);
    });
  });


  it("Add participants and exec transfer should throw with over 100 units", function() {
    return EnergyMarket.new().then(function(_market) {
        market = _market;
        return market.addParticipant();

    }).then(function() {
        return market.addParticipant();

    }).then(function() {
        return market.addStoredEnergy(producer, storedEnergyINVALID);

    }).then(function() {
        return market.depositEnergyTokens(consumer, storedEnergyINVALID);

    }).then(function() {
        return market.tokenBalance.call(consumer);

    }).then(function(balance) {
        return market.transferEnergy(producer, consumer, storedEnergyINVALID);

    }).then(function(returnValue) {
			assert(false, 'exec transfer was supposed to throw but did not when selling to large amount of energy');

	}).catch(function(error){
		// Error msg should contain invalid JUMP
		if(error.toString().indexOf('invalid JUMP') == -1) {
			assert(false, error.toString());
		}
	});
  });
});
