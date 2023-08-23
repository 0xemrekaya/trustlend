import React, { useState, useEffect } from 'react';
import './App.css';


import TrustLend from './artifacts/contracts/TrustLend.sol/TrustLend.json';
import wETH from './artifacts/contracts/TrustLend.sol/wETH.json';
import IUSD from './artifacts/contracts/TrustLend.sol/IUSDContract.json';
import { ethers } from 'ethers';

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [amountLender, setAmountLender] = useState("");
  const [collateralLender, setCollateralLender] = useState("");
  const [totalLender, setTotalLender] = useState("");
  const [durationLender, setDurationLender] = useState("");
  let [address, setAddress] = useState(null);
  const [lenderAmount, setLenderAmount] = useState(100);
  const [interestRate, setInterestRate] = useState(10);
  const [coinAmount, setCoinAmount] = useState(20);
  const [borrowerEth, setBorrowerEth] = useState(120);
  const [borrowedAmount, setBorrowedAmount] = useState(110);
  const [loanDuration, setLoanDuration] = useState(5);
  const [isLoanPaid, setIsLoanPaid] = useState(false);
  let [ethPrice, setEthPrice] = useState(0);
  const [remainingTime, setRemainingTime] = useState(loanDuration * 30 * 24 * 60 * 60);
  const [amount, setAmount] = useState("");
  const [collateral, setCollateral] = useState("");
  const [total, setTotal] = useState("");
  const [duration, setDuration] = useState("");
  let [tx, setTx] = useState("");

  const TrustLend_ABI = TrustLend.abi;
  const TrustLend_Address = "0x7b6604E167f9f7eB56c95BDd2305f6aDE641D4e2";
  const SERVER_URL = process.env.RPC_URL_HAQQTEST2;
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const TrustLendProvider = new ethers.Contract(TrustLend_Address, TrustLend_ABI, provider);
  const signer = provider.getSigner();
  const TrustLendSigner = new ethers.Contract(TrustLend_Address, TrustLend_ABI, signer);

  let isMetamaskConnected = false;

  const metamaskWalletConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        address = await signer.getAddress();
        setAddress(address);
        isMetamaskConnected = true;
        const shortAddress = address.substring(0, 10);
        const metamaskStatus = document.getElementById("metamask-status");
        if (isMetamaskConnected) {
          metamaskStatus.classList.add("metamask-connected");
          metamaskStatus.textContent = shortAddress + "...";
        } else {
          metamaskStatus.classList.add("metamask-disconnected");
          metamaskStatus.textContent = "Disconnected";
        }

        await setSellers();
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('There is no web3 wallet');
    }
  };

  const setSellers = async () => {
    const sellerList = await TrustLendProvider.sellers;
     console.log( await sellerList);
  };


  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleCollateralChange = (event) => {
    setCollateral(event.target.value);
  };

  const handleTotalChange = (event) => {
    setTotal(event.target.value);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleLendClick = async () => {
    if (!provider) {
      alert('You need to connect to MetaMask first.');
      return;
    }
    tx = await TrustLendSigner.lend(amount, collateral, total, duration);
    await tx.wait();
    setTx(tx.hash);
    console.log("Loan lent!");
  };


  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const formatTime = (timeInSeconds) => {
    const days = Math.floor(timeInSeconds / (60 * 60 * 24));
    const hours = Math.floor((timeInSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeInSeconds % (60 * 60)) / 60);
    const seconds = timeInSeconds % 60;

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
  };

  const lenders = [
    {
      id: 1,
      profileImage: 'https://dummyimage.com/40x40/00a6d3/ffffff.png&text=AV',
      walletAddress: 'azato.eth',
      coinAmount: 20,
      price: 110,
      collateral: 2.5,
      loanDuration: 5,
    },
    {
      id: 2,
      profileImage: 'https://dummyimage.com/40x40/4caf50/ffffff.png&text=CR',
      walletAddress: 'emrekaya.eth',
      coinAmount: 30,
      price: 150,
      collateral: 3,
      loanDuration: 4,
    },
    {
      id: 3,
      profileImage: 'https://dummyimage.com/40x40/ffeb3b/000000.png&text=KP',
      walletAddress: 'emin.pdf',
      coinAmount: 25,
      price: 125,
      collateral: 2,
      loanDuration: 6,
    },
    {
      id: 4,
      profileImage: 'https://dummyimage.com/40x40/ff5722/ffffff.png&text=XY',
      walletAddress: '0xcba9876',
      coinAmount: 18,
      price: 90,
      collateral: 1.8,
      loanDuration: 3,
    },
    {
      id: 5,
      profileImage: 'https://dummyimage.com/40x40/e91e63/ffffff.png&text=JR',
      walletAddress: '0xfedcba9',
      coinAmount: 22,
      price: 115,
      collateral: 2.2,
      loanDuration: 7,
    },
  ];

  const [selectedLender, setSelectedLender] = useState(null);

  const openLenderDetails = (lender) => {
    setSelectedLender(lender);
  };

  const closeLenderDetails = () => {
    setSelectedLender(null);
  };

  const handleBorrow = () => {
    setIsLoanPaid(true);
  };

  return (
    <div className="App">
      <div className="header">
        <button className="header-button">Whitepaper</button>
        <button className="header-button">Roadmap</button>
        <div>
          <span id="metamask-status" className="metamask-status"></span>
          {address ? (null
          ) : (
            <button className="header-button" onClick={metamaskWalletConnect}>Connect with MetaMask</button>
          )}
        </div>
      </div>
      <div className="price-tracker">
        <button className="price-button">
          1 ETH = $1000
        </button>
        <button className="price-button">
          1 ISLM = $5
        </button>
      </div>
      <h1>TrustLend</h1>
      <div>
        <button onClick={() => setShowPopup(true)} className="create-lend-button">Create a Lend</button>
        {showPopup && (
          <div className="popup">
            <div className="popup-inner">
              <button className="close-button" onClick={() => setShowPopup(false)}>×</button>
              <h2>Create a Lend</h2>
              <form>
                <label>
                  Amount:
                  <input type="text" value={amount} onChange={handleAmountChange} />
                </label>
                <label>
                  Collateral:
                  <input type="text" value={collateral} onChange={handleCollateralChange} />
                </label>
                <label>
                  Total:
                  <input type="text" value={total} onChange={handleTotalChange} />
                </label>
                <label>
                  Duration:
                  <input type="text" value={duration} onChange={handleDurationChange} />
                </label>
                <button type="button" onClick={handleLendClick} className="lend-button">
                  Lend
                </button>
                Transaction Hash: {tx}
              </form>
            </div>
          </div>
        )}
      </div>
      <div className="lender-list">
        <h2>Lenders</h2>
        <table>
          <thead>
            <tr>
              <th>Profile</th>
              <th>Wallet Address</th>
              <th>Coin Amount</th>
              <th>Price</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {lenders.map((lender) => (
              <tr key={lender.id}>
                <td>
                  <img src={lender.profileImage} alt="Profile" />
                </td>
                <td>{lender.walletAddress}</td>
                <td>{lender.coinAmount} ISLM</td>
                <td>${lender.price}</td>
                <td>
                  <button className="details-button" onClick={() => openLenderDetails(lender)}>
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedLender && (
        <div className="lender-details-modal">
          <div className="modal-content">
            <span className="close" onClick={closeLenderDetails}>
              &times;
            </span>
            <h2>Lender Details</h2>
            <p>Amount: {selectedLender} Amount</p>
            <p>Collateral: {selectedLender.collateral} ETH</p>
            <p>Collateral: {selectedLender.collateral} ETH</p>
            <p>Loan Duration: {selectedLender.loanDuration} months</p>
            <button className="borrow-button" onClick={handleBorrow}>
              Borrow
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
