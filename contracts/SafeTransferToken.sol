pragma solidity ^0.4.18;

import '../node_modules/zeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

// 安全に転送できるERC20 Token 実装
//

contract SafeTransferToken is StandardToken {

  mapping(address => address[]) internal receivables;
  mapping(address => uint256) internal depositing;

  /**
  * @dev does not tranfer because avoid loss. this methods only record approval info.
  *      after, receiver need call recieve() for transfer.
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balanceOf(msg.sender));

    allowed[msg.sender][_to] = _value;
    receivables[_to].push(msg.sender); //register sender address.
    depositing[msg.sender] = depositing[msg.sender].add(_value);
    Approval(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool) {
    return transfer(_spender, _value);
  }

  /**
   * @dev Transfer tokens from one address to another
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 the amount of tokens to be transferred
   */
  function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[_from]);
    require(_value <= allowed[_from][msg.sender]);

    balances[_from] = balances[_from].sub(_value);
    balances[_to] = balances[_to].add(_value);
    allowed[_from][msg.sender] = allowed[_from][msg.sender].sub(_value);
    depositing[_from] = depositing[_from].sub(_value);

    Transfer(_from, _to, _value);
    return true;
  }

  function receive() public returns(bool) {
    address[] memory table = receivables[msg.sender];
    require(table.length > 0);
    return true;
  }

  /**
  * @dev Gets the receivable balances of the specified address.
  * @param _owner The address to query the the receivable balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function receivableBalancesOf(address _owner) public constant returns (uint) {
    uint balance = 0;
    for(uint i=0; i< receivables[_owner].length; i++) {
      address depositer = receivables[_owner][i];
      balance += allowed[depositer][msg.sender];
    }
    return balance;
  }

  /**
  * @dev Gets the received count of the specified address.
  * @param _owner The address to query the the receiveable of.
  * @return An uint256 representing the number of receivable owned by the passed address.
  */
  function receivablesCount(address _owner) public constant returns (uint) {
    return receivables[_owner].length;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return balances[_owner].sub(depositing[_owner]);
  }
}
