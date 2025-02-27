import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send } from 'lucide-react';

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [department, setDepartment] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle review submission
  };

  const starLabels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-xl"
      >
        <h1 className="text-3xl font-bold neon-text mb-6">Share Your Experience</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-white mb-2">How was your experience?</label>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className={`p-1 transition-colors duration-200`}
                  >
                    <Star
                      className={`h-10 w-10 ${
                        star <= (hoveredStar || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-400'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={hoveredStar || rating}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="text-white text-lg"
                >
                  {(hoveredStar || rating) ? starLabels[(hoveredStar || rating) - 1] : 'Select a rating'}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-lg font-medium text-white mb-2">
              Department
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="input-field w-full"
            >
              <option value="">Select a department</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label htmlFor="title" className="block text-lg font-medium text-white mb-2">
              Review Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field w-full"
              placeholder="Summarize your experience"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label htmlFor="content" className="block text-lg font-medium text-white mb-2">
              Your Review
            </label>
            <textarea
              id="content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field w-full resize-none"
              placeholder="Share your experience in detail..."
            />
          </motion.div>

          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="button-primary inline-flex items-center space-x-2"
            >
              <span>Submit Review</span>
              <Send className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateReview;