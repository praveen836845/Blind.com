import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Reviews from './pages/Reviews';
import CreateReview from './pages/CreateReview';
import { WalletProvider } from './WalletContext'; // Import the WalletProvider

function App() {
  return (
    <WalletProvider> {/* Wrap the entire app with WalletProvider */}
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/create-review" element={<CreateReview />} />
            </Routes>
          </motion.div>
        </div>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
