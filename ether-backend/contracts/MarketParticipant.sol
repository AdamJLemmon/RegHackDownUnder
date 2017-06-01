pragma solidity ^0.4.6;

contract MarketParticipant {
	/*
	* External
	*/
	/// @dev Validate a new tx against regulation
	function validateTx(uint amount) external returns(bool isValid) {
		// TODO: actual validation vs regulations
		if (amount < 100)
			isValid = true;
	}
}
