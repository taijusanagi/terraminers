// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Material is Ownable, ERC20 {
  address public equipment;

  constructor() ERC20("TerraMinersMaterial", "TMM") {}

  function setEquipment(address _material) public onlyOwner {
    equipment = _material;
  }

  function mint(address to, uint256 amount) public {
    require(msg.sender == equipment, "Material: msg sender invalid");
    _mint(to, amount);
  }
}
