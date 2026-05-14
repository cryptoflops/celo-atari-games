import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("GasGobblerScoreRegistry", function () {
  async function deployFixture() {
    const [owner, signer, player, otherAccount] = await ethers.getSigners();

    const GasGobblerScoreRegistry = await ethers.getContractFactory("GasGobblerScoreRegistry");
    const registry = await GasGobblerScoreRegistry.deploy();

    await registry.setSigner(signer.address);

    return { registry, owner, signer, player, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { registry, owner } = await loadFixture(deployFixture);
      expect(await registry.owner()).to.equal(owner.address);
    });

    it("Should set the right signer", async function () {
      const { registry, signer } = await loadFixture(deployFixture);
      expect(await registry.signerAddress()).to.equal(signer.address);
    });
  });

  describe("Score Submission", function () {
    async function getSignature(
      registry: any,
      signer: any,
      sessionId: string,
      player: string,
      score: number,
      nonce: number,
      deadline: number
    ) {
      const domain = {
        name: "GasGobblerScoreRegistry",
        version: "1",
        chainId: (await ethers.provider.getNetwork()).chainId,
        verifyingContract: await registry.getAddress(),
      };

      const types = {
        ScoreAttestation: [
          { name: "sessionId", type: "bytes32" },
          { name: "player", type: "address" },
          { name: "score", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      };

      const value = {
        sessionId,
        player,
        score,
        nonce,
        deadline,
      };

      return await signer.signTypedData(domain, types, value);
    }

    it("Should submit a valid score successfully", async function () {
      const { registry, signer, player } = await loadFixture(deployFixture);
      
      const sessionId = ethers.id("session-1");
      const score = 1200;
      const nonce = 0;
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      const signature = await getSignature(registry, signer, sessionId, player.address, score, nonce, deadline);

      await expect(registry.connect(player).submitScore(sessionId, player.address, score, nonce, deadline, signature))
        .to.emit(registry, "ScoreSubmitted")
        .withArgs(player.address, score, sessionId, (val: any) => val > 0);

      expect(await registry.submissionCount()).to.equal(1);
      expect(await registry.usedSessions(sessionId)).to.be.true;
      expect(await registry.playerNonces(player.address)).to.equal(1);
    });

    it("Should reject an expired signature", async function () {
      const { registry, signer, player } = await loadFixture(deployFixture);
      
      const sessionId = ethers.id("session-2");
      const score = 1200;
      const nonce = 0;
      const deadline = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      const signature = await getSignature(registry, signer, sessionId, player.address, score, nonce, deadline);

      await expect(
        registry.connect(player).submitScore(sessionId, player.address, score, nonce, deadline, signature)
      ).to.be.revertedWith("Signature expired");
    });

    it("Should reject an invalid nonce", async function () {
      const { registry, signer, player } = await loadFixture(deployFixture);
      
      const sessionId = ethers.id("session-3");
      const score = 1200;
      const nonce = 1; // Expected is 0
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const signature = await getSignature(registry, signer, sessionId, player.address, score, nonce, deadline);

      await expect(
        registry.connect(player).submitScore(sessionId, player.address, score, nonce, deadline, signature)
      ).to.be.revertedWith("Invalid nonce");
    });

    it("Should reject a used session (replay attack)", async function () {
      const { registry, signer, player } = await loadFixture(deployFixture);
      
      const sessionId = ethers.id("session-4");
      const score = 1200;
      const nonce = 0;
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const signature = await getSignature(registry, signer, sessionId, player.address, score, nonce, deadline);

      // First submission succeeds
      await registry.connect(player).submitScore(sessionId, player.address, score, nonce, deadline, signature);

      // Second submission fails
      await expect(
        registry.connect(player).submitScore(sessionId, player.address, score, nonce, deadline, signature)
      ).to.be.revertedWith("Session already used");
    });

    it("Should reject a signature from a non-signer", async function () {
      const { registry, player, otherAccount } = await loadFixture(deployFixture);
      
      const sessionId = ethers.id("session-5");
      const score = 1200;
      const nonce = 0;
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      // Sign with wrong account
      const signature = await getSignature(registry, otherAccount, sessionId, player.address, score, nonce, deadline);

      await expect(
        registry.connect(player).submitScore(sessionId, player.address, score, nonce, deadline, signature)
      ).to.be.revertedWith("Invalid signature");
    });
  });
});
