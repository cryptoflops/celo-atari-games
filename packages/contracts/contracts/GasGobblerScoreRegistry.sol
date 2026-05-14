// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract GasGobblerScoreRegistry is EIP712, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    address public signerAddress;
    uint256 public submissionCount;

    // Mapping of session IDs to prevent replay attacks
    mapping(bytes32 => bool) public usedSessions;
    
    // Nonce for each player to prevent signature replay
    mapping(address => uint256) public playerNonces;

    struct ScoreSubmission {
        address player;
        uint256 score;
        bytes32 sessionId;
        uint256 timestamp;
    }

    // Store submissions
    mapping(uint256 => ScoreSubmission) public submissions;

    event ScoreSubmitted(
        address indexed player,
        uint256 indexed score,
        bytes32 indexed sessionId,
        uint256 timestamp
    );
    event SignerUpdated(address newSigner);

    // EIP-712 TypeHash
    bytes32 constant SCORE_ATTESTATION_TYPEHASH = keccak256(
        "ScoreAttestation(bytes32 sessionId,address player,uint256 score,uint256 nonce,uint256 deadline)"
    );

    constructor() EIP712("GasGobblerScoreRegistry", "1") Ownable(msg.sender) {}

    function setSigner(address _signerAddress) external onlyOwner {
        signerAddress = _signerAddress;
        emit SignerUpdated(_signerAddress);
    }

    function submitScore(
        bytes32 sessionId,
        address player,
        uint256 score,
        uint256 nonce,
        uint256 deadline,
        bytes calldata signature
    ) external nonReentrant {
        require(msg.sender == player, "Only player can submit");
        require(block.timestamp <= deadline, "Signature expired");
        require(!usedSessions[sessionId], "Session already used");
        require(nonce == playerNonces[player], "Invalid nonce");
        require(signerAddress != address(0), "Signer not set");

        bytes32 structHash = keccak256(
            abi.encode(
                SCORE_ATTESTATION_TYPEHASH,
                sessionId,
                player,
                score,
                nonce,
                deadline
            )
        );

        bytes32 hash = _hashTypedDataV4(structHash);
        address recoveredSigner = ECDSA.recover(hash, signature);
        
        require(recoveredSigner == signerAddress, "Invalid signature");

        // Mark session as used and increment nonce
        usedSessions[sessionId] = true;
        playerNonces[player]++;

        // Record submission
        uint256 id = submissionCount++;
        submissions[id] = ScoreSubmission({
            player: player,
            score: score,
            sessionId: sessionId,
            timestamp: block.timestamp
        });

        emit ScoreSubmitted(player, score, sessionId, block.timestamp);
    }

    function getPlayerSubmissions(address player) external view returns (ScoreSubmission[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < submissionCount; i++) {
            if (submissions[i].player == player) {
                count++;
            }
        }

        ScoreSubmission[] memory result = new ScoreSubmission[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < submissionCount; i++) {
            if (submissions[i].player == player) {
                result[index] = submissions[i];
                index++;
            }
        }
        return result;
    }
}
