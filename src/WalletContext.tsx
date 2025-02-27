import React, { createContext, useState, useContext } from 'react';

// Create context
const WalletContext = createContext();

// Custom hook to use wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component to wrap around the app
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');

  return (
    <WalletContext.Provider value={{ walletAddress, setWalletAddress }}>
      {children}
    </WalletContext.Provider>
  );
};
