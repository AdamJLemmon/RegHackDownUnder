pragma solidity ^0.4.6;

import './MarketParticipant.sol';

contract EnergyMarket {
	/*
	* Storage
	*/
	// Producer or Consumer address mapped to balance of tokens
	mapping(address=>uint) public tokenBalance;

	// Producer address mapped to the amount of stored energy
	mapping(address=>uint) public storedEnergy;

	// Collection of all contracts participating, validating
	address[] public marketParticipants;

	/*
	* Events
	*/
	event AddStoredEnergy(address producer, uint amount);
	event TransferEnergy(address producer, address consumer, uint amount);
	event TxValidation(address validtor, bool isValid);

	/*
	* Public
	*/
	/// @dev New energy stored within battery as the producer
	function addParticipant() public {
		marketParticipants.push(new MarketParticipant());
	}

	/// @dev New energy stored within battery as the producer
	/// @param producer the ID for this producer
	/// @param amount the amount of energy added
	function addStoredEnergy(address producer, uint amount) public {
		storedEnergy[producer] += amount;
		AddStoredEnergy(producer, amount);
	}

	/// @dev Deposit newly purchased energy tokens
	/// enabling consumers to purchase real energy units
	/// @param consumer ..
	/// @param amount ..
	function depositEnergyTokens(address consumer, uint amount) public {
		tokenBalance[consumer] += amount;
	}

	/// @dev Sell energy from a producer to a consumer
	/// transfer tokens to the producer
	/// @param producer address the energy is taken from and token allocated to
	/// @param consumer the consumer that is paying tokens for the energy
	/// @param amount the amount of energy to transfer
	function transferEnergy(
		address producer,
		address consumer,
		uint amount
	)
		public
	{
		// Check that the consumer has enough funds and producer enough energy
		if (storedEnergy[producer] < amount || tokenBalance[consumer] < amount) throw;

		// Transfer the value
		storedEnergy[producer] -= amount;
		tokenBalance[consumer] -= amount;
		tokenBalance[producer] += amount;

		// TODO: get rid of this loop, push to a broadcast to network participants outside of contract
		for (var i = 0; i < marketParticipants.length; i++){
			// Broadcast to all peers to validate
			MarketParticipant peer = MarketParticipant(marketParticipants[i]);
			if (!peer.validateTx(amount)) throw;
			TxValidation(peer, true);
		}

		TransferEnergy(producer, consumer, amount);
	}
}
