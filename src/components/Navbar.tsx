import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Menu } from 'lucide-react';
import { useWallet } from '../WalletContext'; // Import context

const Navbar = () => {
  const { walletAddress } = useWallet(); // Get wallet address from context

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Eye className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Blind.com</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/reviews" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md">
              Reviews
            </Link>
            {walletAddress ? (
              <span className="bg-gray-200 px-4 py-2 rounded-md text-gray-700">
                {walletAddress}
              </span>
            ) : (
              <Link to="/login" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Sign In
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button className="text-gray-700">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
