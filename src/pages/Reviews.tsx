import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, MessageSquare, Star, Search, CheckCircle } from 'lucide-react';
import { initializeContract, fetchPosts } from '../utils/contractinteraction';

const categories = ['All', 'Engineering', 'Product', 'Design', 'Marketing', 'Sales'];

const Reviews = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch posts from the contract
  const initializeContractAndFetchPosts = async () => {
    const contract = await initializeContract();
    if (contract) {
      const fetchedPosts = await fetchPosts(contract);
      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts); // Default display all posts
    }
    setLoading(false);
  };

  useEffect(() => {
    initializeContractAndFetchPosts();
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = posts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter (skip if "All" is selected)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, selectedCategory, posts]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold gradient-text mb-6">Company Reviews</h1>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search companies or keywords..."
            className="input-field w-full pl-12 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full shadow-md transition-shadow whitespace-nowrap 
              ${selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-blue-100'}`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Review List */}
      <div className="review-grid">
        {loading ? (
          <p>Loading posts...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-lg mb-4"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{post.company}</h3>
                  <p className="text-gray-500">Post ID: {post.id}</p>
                </div>
                <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold text-gray-700">4.5</span>
                </div>
              </div>

              <h4 className="text-lg font-medium text-gray-800 mb-2">Review</h4>
              <p className="text-gray-600 mb-4">{post.content}</p>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                </div>
                <div className="flex items-center space-x-2">
                  {post.proof === "true" && (
                    <CheckCircle className="text-green-500 h-5 w-5" />
                  )}
                  <span className="text-sm text-gray-500">{post.proof === "true" ? "Verified ✅" : "Not Verified"}</span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
