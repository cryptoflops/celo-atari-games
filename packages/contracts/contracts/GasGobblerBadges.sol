// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GasGobblerBadges is Ownable {
    struct BadgeMetadata {
        string name;
        string description;
        string imageURI;
    }

    // Badge IDs are 1-indexed
    mapping(uint256 => BadgeMetadata) public badgeRegistry;
    uint256 public totalBadgeTypes;

    // player => badgeId => hasBadge
    mapping(address => mapping(uint256 => bool)) public hasBadge;

    event BadgeClaimed(address indexed player, uint256 indexed badgeId, uint256 timestamp);
    event BadgeCreated(uint256 indexed badgeId, string name);

    constructor() Ownable(msg.sender) {
        // Initialize default badges
        _createBadge("First Gobble", "Completed your first game of Gas Gobbler", "ipfs://first-gobble");
        _createBadge("Score 500", "Achieved a score of 500 or more", "ipfs://score-500");
        _createBadge("Celo Scholar", "Completed the Celo educational onboarding", "ipfs://celo-scholar");
    }

    function _createBadge(string memory name, string memory description, string memory imageURI) internal {
        totalBadgeTypes++;
        badgeRegistry[totalBadgeTypes] = BadgeMetadata(name, description, imageURI);
        emit BadgeCreated(totalBadgeTypes, name);
    }

    function createBadge(string memory name, string memory description, string memory imageURI) external onlyOwner {
        _createBadge(name, description, imageURI);
    }

    function claimBadge(address player, uint256 badgeId) external onlyOwner {
        require(badgeId > 0 && badgeId <= totalBadgeTypes, "Badge doesn't exist");
        require(!hasBadge[player][badgeId], "Player already has this badge");

        hasBadge[player][badgeId] = true;
        emit BadgeClaimed(player, badgeId, block.timestamp);
    }

    function getBadge(uint256 badgeId) external view returns (BadgeMetadata memory) {
        require(badgeId > 0 && badgeId <= totalBadgeTypes, "Badge doesn't exist");
        return badgeRegistry[badgeId];
    }
}
