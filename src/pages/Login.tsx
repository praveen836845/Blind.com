import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { connect } from '@starknet-io/get-starknet';
import { useNavigate } from 'react-router-dom';
import { WalletAccount } from 'starknet';
import { useWallet } from '../WalletContext'; // Import context

const madaraDevnetRPC = 'http://localhost:9944';

const Login = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [users, setUsers] = useState([]);
  const [showWalletConnect, setShowWalletConnect] = useState(false);
  const navigate = useNavigate();
  const { walletAddress, setWalletAddress } = useWallet(); // Use context

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsers([...users, { email, company }]);
    setShowWalletConnect(true);
  };

  const handleWalletConnect = async () => {
    try {
      const selectedWalletSWO = await connect({ modalMode: 'alwaysAsk', modalTheme: 'light' });
      if (!selectedWalletSWO) {
        console.error('No wallet selected');
        return;
      }

      const myWalletAccount = await WalletAccount.connect(
        { nodeUrl: madaraDevnetRPC },
        selectedWalletSWO
      );
      const address = myWalletAccount.address;
      setWalletAddress(`${address.slice(0, 6)}...${address.slice(-4)}`); // Set in context
      setShowWalletConnect(false);
      navigate('/')
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg"
      >
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in with your email & company
          </h2>
        </div>

        {!showWalletConnect && !walletAddress && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <input
                type="email"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-t-md"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-b-md"
                placeholder="Company Name"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Sign In
            </button>
          </form>
        )}
        
        {showWalletConnect && (
          <button
            onClick={handleWalletConnect}
            className="w-full py-2 px-4 text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            Connect ArgentX Wallet
          </button>
        )}
      
      </motion.div>
    </div>
  );
};

export default Login;
