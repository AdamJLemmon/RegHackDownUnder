pragma solidity ^0.4.6;

//Proxy contract utilized to test contracts that should throw errors

/// @title Proxy contract for testing throws
contract ThrowProxy {
  address public target;
  bytes data;

  /// @dev Constructor set the target of this proxy
  /// @param _target :the contract address to forward requests to
  function ThrowProxy(address _target) {
    target = _target;
  }    

  /// @dev prime the data using the fallback function.
  function() {
    data = msg.data;
  }

  /// @dev called to execute the method of the contract, target, 
  /// this is a proxy for passing in data set in fallback 
  /// @return the result of calling the target method
  function execute() returns (bool) {
    return target.call(data);
  }
}