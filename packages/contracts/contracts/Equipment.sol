// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./Material.sol";

contract Equipment is Ownable, ERC721 {
  enum Direction {
    Right,
    Left,
    Front,
    Back
  }

  struct Location {
    uint256 x;
    uint256 y;
  }

  event Mined(uint256 indexed tokenId, Location indexed newLocation, uint256 amount);

  mapping(uint256 => uint256) public startTimestamp;
  mapping(uint256 => uint256) public lastActionTimestamp;
  mapping(uint256 => Location) public locations;
  mapping(uint256 => mapping(uint256 => bool)) public claimed;

  uint256 public totalSupply;
  address public material;

  uint256 public constant price = 0.01 ether;
  uint256 public constant cooldown = 1 days / 4;
  uint256 public constant materialAmountLimitPerLocation = 100;
  uint256 public constant decimals = 10**18;

  constructor() ERC721("TerraMinersEquipment", "TME") {}

  function withdraw() public onlyOwner {
    payable(msg.sender).transfer(address(this).balance);
  }

  function setMaterial(address _material) public onlyOwner {
    material = _material;
  }

  function mint() public payable {
    require(msg.value == price, "Equipment: msg value invalid");
    uint256 tokenId = totalSupply;
    _mint(msg.sender, tokenId);
    totalSupply++;
    locations[tokenId] = calculateLocation(tokenId, blockhash(block.number - 1));
    _mine(tokenId);
  }

  function move(uint256 tokenId, Direction direction) public payable {
    require(msg.sender == ownerOf(tokenId), "Equipment: msg sender invalid");
    require(block.timestamp >= lastActionTimestamp[tokenId] + cooldown, "Equipment: timestamp invalid");
    if (direction == Direction.Right) {
      locations[tokenId].x++;
    } else if (direction == Direction.Left) {
      locations[tokenId].x--;
    } else if (direction == Direction.Front) {
      locations[tokenId].y++;
    } else if (direction == Direction.Back) {
      locations[tokenId].y--;
    }
    _mine(tokenId);
  }

  function calculateLocation(uint256 tokenId, bytes32 lastBlockhash) public pure returns (Location memory) {
    uint256 x = uint256(keccak256(abi.encodePacked(tokenId, lastBlockhash, "x")));
    uint256 y = uint256(keccak256(abi.encodePacked(tokenId, lastBlockhash, "y")));
    return Location(x, y);
  }

  function calculateMaterialAmount(Location memory location) public pure returns (uint256) {
    return (uint256(keccak256(abi.encode(location))) % materialAmountLimitPerLocation) * decimals;
  }

  function _mine(uint256 tokenId) internal {
    Location memory location = locations[tokenId];
    uint256 amount;
    if (!claimed[location.x][location.y]) {
      claimed[location.x][location.y] = true;
      amount = calculateMaterialAmount(location);
      Material(material).mint(msg.sender, amount);
    }
    lastActionTimestamp[tokenId] = block.timestamp;
    emit Mined(tokenId, location, amount);
  }
}
