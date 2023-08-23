import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [lenderAmount, setLenderAmount] = useState(100);
  const [interestRate, setInterestRate] = useState(10);
  const [coinAmount, setCoinAmount] = useState(20);
  const [borrowerEth, setBorrowerEth] = useState(120);
  const [borrowedAmount, setBorrowedAmount] = useState(110);
  const [loanDuration, setLoanDuration] = useState(5);
  const [isLoanPaid, setIsLoanPaid] = useState(false);
  const [ethPrice, setEthPrice] = useState(1500);
  const [remainingTime, setRemainingTime] = useState(loanDuration * 30 * 24 * 60 * 60);

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
        <button className="header-button">Connect Wallet</button>
      </div>
      <div className="price-tracker">
        <button className="price-button">
          1 ETH = ${ethPrice}
        </button>
        <button className="price-button">
          1 ISLM = $5
        </button>
      </div>
      <h1>TrustLend</h1>
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
