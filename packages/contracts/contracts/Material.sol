// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Material is ERC20 {
  address public equipment;

  constructor(address _equipment) ERC20("TerraMinersMaterial", "TMM") {}

  function mint(address to, uint256 amount) public {
    require(msg.sender == equipment, "Material: msg sender invalid");
    _mint(to, amount);
  }
}
