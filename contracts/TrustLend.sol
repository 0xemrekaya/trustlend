// SPDX-License-Identifier: UNLICENSED
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
pragma solidity ^0.8.9;

contract IUSDContract is ERC20, ERC20Burnable, Pausable, Ownable {
    
    // track the lender balances for trustLend contract
    mapping(address => uint256) balances;
    uint256 private sendAmount = 100000e18;

    constructor() ERC20("IUSD Token", "IUSD") {
        _mint(msg.sender, sendAmount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}

contract wETH is ERC20, ERC20Burnable, Pausable, Ownable {
    mapping(address => uint256) balances;
    uint256 private sendAmount = 100000e18;

    constructor() ERC20("wETH Token", "wETH") {
        _mint(msg.sender, sendAmount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}

contract TrustLend is Ownable{

    IERC20 public immutable ETH;
    IERC20 public immutable IUSD;

    // data struct for to store info of lenders and borrowers
    struct Seller {
        address sellerAddress; // lender's or borrower's evm address
        uint amount; // loan or borrow amount
        uint collateral;
        uint total; // total repayment amount
        uint duration; // loan duration for check expiration
        bool available; // is it avaliable for lending or not?
        bool paid; // loan or borrower paid or not?
    }

    // track the lenders with mapping
    mapping(address => Seller) public lenders;

    constructor(address _wETH,address _IUSD) {
        ETH = IERC20(_wETH);
        IUSD = IERC20(_IUSD);
    }

    modifier updateLoan(address lenderAddr){
        Seller storage seller = lenders[lenderAddr];
        require(seller.paid==false, "Lender paid is true");
        _;
    }
    
    uint ethPrice = 1000; // ETH price in USD
    uint islmPrice = 5;
    uint startTime;
    //uint256 public contractBalance;
    address payable payableContractAddress = payable(address(this));

    event LoanLent(address indexed lender, uint amount);
    event LoanBorrowed(address indexed borrower, uint loanAmount);
    event LoanLiquidated(address indexed borrower);
    event Payment(address indexed borrower, uint amount);

    receive() external payable {}

    // send islm tokens to the receipent
    function sendISLM(address payable recipient, uint256 amount) public {
        require(address(this).balance >= amount, "Insufficient balance in the contract");
        recipient.transfer(amount);
    }
    
    // lend tokens to the contract
    function lend(uint _amount, uint _collateral, uint _total, uint _duration) public payable {
        require(_amount > 0, "Amount must be greater than 0");
        require(_collateral > 0, "Collateral must be greater than 0");
        require(_total > 0, "Price must be greater than 0");
        require(_duration > 0, "Duration must be greater than 0");
        payable(payableContractAddress).transfer(_amount);
        lenders[msg.sender] = Seller(msg.sender, _amount, _collateral, _total, _duration, true, false);
        emit LoanLent(msg.sender, _amount);
    }

    // borrow tokens from a lender - peer to peer lending
    function borrow(address lenderAddr) public payable {
        require(ETH.balanceOf(msg.sender) > 0, "Value must be greater than 0");
        Seller storage seller = lenders[lenderAddr];
        require(seller.amount > 0, "Lender does not exist or amount is not exist");
        require(seller.collateral <= ETH.balanceOf(msg.sender), "Insufficient collateral");
        require(seller.paid == false, "Loan already paid");
        require(seller.available == true, "The saler is not available");

        startTime = block.timestamp;

        //approve the token spending
        ETH.approve(msg.sender, seller.collateral);

        //transfer it to the address
        ETH.transferFrom(msg.sender, address(this), seller.collateral);
        sendISLM(payable(msg.sender), seller.amount);

        // update the seller avaliability
        seller.available == false;
        emit LoanBorrowed(msg.sender, seller.amount);
    }

    // pay your loan to the lender address
    function payment(address lenderAddr) public payable {
        Seller storage seller = lenders[lenderAddr];
        require(seller.amount > 0, "Lender does not exist or amount is not exist");
        require(seller.paid == false, "Loan already paid");
        require(IUSD.balanceOf(msg.sender)>=seller.total, "You dont have IUSD for payment");

        // approve token spending and transfer it
        IUSD.approve(msg.sender, seller.total);
        IUSD.transferFrom(msg.sender, lenderAddr, seller.total);
        ETH.transfer(msg.sender, seller.collateral);

        //update seller paid cond.
        seller.paid = true;
        startTime=0;
        lenders[lenderAddr] = Seller(msg.sender,0, 0, 0, 0, false, false);
        emit Payment(msg.sender, seller.total);
    }

    function liquidate(address borrower) public payable {
        Seller storage lender = lenders[borrower];

        require(lender.amount > 0, "Lender does not exist");
        // if it is paid
        require(lender.paid == true, "Loan already paid");

        // eth price must be below the total lended asset
        require(ethPrice < lender.total, "ETH price is not below loan price");
        
        // transfer colleteral to lender
        ETH.transfer(msg.sender, lender.collateral);

        // update lender status
        lender.paid = true;

        emit LoanLiquidated(borrower);
    }
}