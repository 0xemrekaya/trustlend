const { expect } = require("chai");

describe("TrustLend", function () {
  let TrustLend;
  let trustLend;
  let wETH;
  let IUSDContract;
  let ETH;
  let iusd;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    TrustLend = await ethers.getContractFactory("TrustLend");
    ETH = await ethers.getContractFactory("wETH");
    wETH = await TrustLend.connect(owner).deploy();
    await wETH.deployed();
    IUSDContract = await ethers.getContractFactory("IUSDContract");
    iusd = await TrustLend.connect(owner).deploy();
    await iusd.deployed();
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    trustLend = await TrustLend.connect(owner).deploy(wETH, iusd);
    await trustLend.deployed();
  });

  describe("borrow", function () {
    it("should borrow successfully", async function () {
      const amount = ethers.utils.parseEther("1");
      const collateral = ethers.utils.parseEther("2");
      const duration = 10;
      const seller = addr1.address;
    
      await owner.sendTransaction({
        to: trustLend.address,
        value: collateral,
      });
    
      await trustLend.connect(addr1).sendISLM(amount);

      await trustLend.connect(addr1).lend(amount, collateral, duration, seller);

      await trustLend.connect(owner).borrow(seller, { value: collateral });
    
      const lender = await trustLend.lenders(seller);
      expect(lender.amount).to.equal(amount);
    });
  });

  describe("payment", function () {
    it("should pay successfully", async function () {
      const amount = ethers.utils.parseEther("1");
      const collateral = ethers.utils.parseEther("2");
      const duration = 10;
      const seller = addr1.address;
    
      await owner.sendTransaction({
        to: trustLend.address,
        value: collateral,
      });

      await trustLend.connect(addr1).sendISLM(amount);

      await trustLend.connect(addr1).lend(amount, collateral, duration, seller);

      await trustLend.connect(owner).borrow(seller, { value: collateral });

      await trustLend.connect(owner).payment(seller, { value: amount });
    
      const lender = await trustLend.lenders(seller);
      expect(lender.paid).to.equal(true);
    });
  });

  // TODO: Add more test cases for other functions
});