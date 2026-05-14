import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("GasGobblerBadges", function () {
  async function deployFixture() {
    const [owner, player, otherAccount] = await ethers.getSigners();

    const GasGobblerBadges = await ethers.getContractFactory("GasGobblerBadges");
    const badges = await GasGobblerBadges.deploy();

    return { badges, owner, player, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { badges, owner } = await loadFixture(deployFixture);
      expect(await badges.owner()).to.equal(owner.address);
    });

    it("Should initialize default badges", async function () {
      const { badges } = await loadFixture(deployFixture);
      expect(await badges.totalBadgeTypes()).to.equal(3);

      const badge1 = await badges.getBadge(1);
      expect(badge1.name).to.equal("First Gobble");
      
      const badge2 = await badges.getBadge(2);
      expect(badge2.name).to.equal("Score 500");
    });
  });

  describe("Badge Claiming", function () {
    it("Should allow owner to claim a badge for a player", async function () {
      const { badges, player } = await loadFixture(deployFixture);
      
      await expect(badges.claimBadge(player.address, 1))
        .to.emit(badges, "BadgeClaimed")
        .withArgs(player.address, 1, (val: any) => val > 0);

      expect(await badges.hasBadge(player.address, 1)).to.be.true;
    });

    it("Should reject non-owner trying to claim a badge", async function () {
      const { badges, player, otherAccount } = await loadFixture(deployFixture);
      
      await expect(
        badges.connect(otherAccount).claimBadge(player.address, 1)
      ).to.be.revertedWithCustomError(badges, "OwnableUnauthorizedAccount");
    });

    it("Should reject claiming a duplicate badge", async function () {
      const { badges, player } = await loadFixture(deployFixture);
      
      await badges.claimBadge(player.address, 1);
      
      await expect(
        badges.claimBadge(player.address, 1)
      ).to.be.revertedWith("Player already has this badge");
    });

    it("Should reject claiming a non-existent badge", async function () {
      const { badges, player } = await loadFixture(deployFixture);
      
      await expect(
        badges.claimBadge(player.address, 99)
      ).to.be.revertedWith("Badge doesn't exist");
    });
  });
});
