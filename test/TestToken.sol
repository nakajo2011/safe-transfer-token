pragma solidity ^0.4.18;

import '../contracts/SafeTransferToken.sol';

contract TestToken is SafeTransferToken {
  string public constant name = "SimpleSafeToken"; // solium-disable-line uppercase
  string public constant symbol = "SST"; // solium-disable-line uppercase
  uint8 public constant decimals = 18; // solium-disable-line uppercase

  uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** uint256(decimals));

  function TestToken() public {
    totalSupply_ = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
    Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }
}
