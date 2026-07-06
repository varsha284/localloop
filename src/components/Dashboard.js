import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BookingModal from './BookingModal';
import AddItemModal from './AddItemModal';
import toast from 'react-hot-toast';

const Dashboard = ({ currentUser }) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [distance, setDistance] = useState(10);
  const [availability, setAvailability] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: 'All Items', color: 'bg-gray-500', icon: 'bi-grid' },
    { id: 'tools', name: 'Tools', color: 'bg-orange-500', icon: 'bi-tools' },
    { id: 'electronics', name: 'Electronics', color: 'bg-blue-500', icon: 'bi-laptop' },
    { id: 'sports', name: 'Sports', color: 'bg-green-500', icon: 'bi-bicycle' },
    { id: 'books', name: 'Books', color: 'bg-purple-500', icon: 'bi-book' },
    { id: 'kitchen', name: 'Kitchen', color: 'bg-red-500', icon: 'bi-cup-hot' },
    { id: 'garden', name: 'Garden', color: 'bg-emerald-500', icon: 'bi-tree' },
    { id: 'music', name: 'Music', color: 'bg-pink-500', icon: 'bi-music-note' },
    { id: 'automotive', name: 'Automotive', color: 'bg-indigo-500', icon: 'bi-car-front' },
    { id: 'home', name: 'Home & Decor', color: 'bg-yellow-500', icon: 'bi-house' }
  ];

  const mockItems = [
    {
      id: 1,
      title: 'Professional Power Drill',
      description: 'High-quality cordless drill perfect for home projects and professional use',
      category: 'tools',
      price: 15,
      period: 'day',
      owner: 'Sarah Johnson',
      distance: 0.3,
      rating: 4.9,
      reviews: 24,
      available: true,
      image: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400',
      tags: ['cordless', 'professional', 'home improvement'],
      condition: 'Excellent',
      deposit: 50,
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'MacBook Pro 16" M3',
      description: 'Latest MacBook Pro with M3 chip for creative work and development',
      category: 'electronics',
      price: 75,
      period: 'day',
      owner: 'Mike Chen',
      distance: 0.7,
      rating: 5.0,
      reviews: 18,
      available: true,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      tags: ['laptop', 'apple', 'creative work', 'M3 chip'],
      condition: 'Like New',
      deposit: 200,
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Trek Mountain Bike',
      description: 'Professional Trek mountain bike perfect for weekend adventures and trails',
      category: 'sports',
      price: 25,
      period: 'day',
      owner: 'Emily Rodriguez',
      distance: 1.2,
      rating: 4.8,
      reviews: 31,
      available: false,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      tags: ['bike', 'mountain', 'outdoor', 'trek'],
      condition: 'Good',
      deposit: 100,
      createdAt: '2024-01-10'
    },
    {
      id: 4,
      title: 'KitchenAid Stand Mixer',
      description: 'Professional KitchenAid stand mixer for all your baking and cooking needs',
      category: 'kitchen',
      price: 12,
      period: 'day',
      owner: 'David Park',
      distance: 0.5,
      rating: 4.7,
      reviews: 15,
      available: true,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      tags: ['baking', 'kitchen', 'mixer', 'kitchenaid'],
      condition: 'Excellent',
      deposit: 75,
      createdAt: '2024-01-18'
    },
    {
      id: 5,
      title: 'Canon EOS R5 Camera',
      description: 'Professional mirrorless camera with multiple lenses for photography',
      category: 'electronics',
      price: 45,
      period: 'day',
      owner: 'Lisa Wang',
      distance: 0.9,
      rating: 4.9,
      reviews: 22,
      available: true,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
      tags: ['camera', 'photography', 'professional', 'canon'],
      condition: 'Excellent',
      deposit: 150,
      createdAt: '2024-01-22'
    },
    {
      id: 6,
      title: 'Complete Garden Tool Set',
      description: 'Professional gardening tools including spades, pruners, and watering equipment',
      category: 'garden',
      price: 8,
      period: 'day',
      owner: 'Robert Kim',
      distance: 0.4,
      rating: 4.6,
      reviews: 12,
      available: true,
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      tags: ['gardening', 'tools', 'yard work', 'complete set'],
      condition: 'Good',
      deposit: 30,
      createdAt: '2024-01-12'
    }
  ];

  useEffect(() => {
    setItems(mockItems);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    const matchesDistance = item.distance <= distance;
    const matchesAvailability = availability === 'all' || 
                               (availability === 'available' && item.available) ||
                               (availability === 'unavailable' && !item.available);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesDistance && matchesAvailability;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'distance': return a.distance - b.distance;
      case 'rating': return b.rating - a.rating;
      case 'newest': return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest': return new Date(a.createdAt) - new Date(b.createdAt);
      default: return 0;
    }
  });

  const toggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(itemId);
      toast.success('Added to favorites');
    }
    setFavorites(newFavorites);
  };

  const handleRequestBorrow = (item) => {
    setSelectedItem(item);
    setShowBookingModal(true);
  };

  const handleShare = (item) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this ${item.title} available for borrowing on LocalLoop!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleAddItem = (newItem) => {
    setItems(prevItems => [newItem, ...prevItems]);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange([0, 100]);
    setDistance(10);
    setAvailability('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {currentUser?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Discover amazing items in your neighborhood
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddItemModal(true)}
              className="btn-primary w-full sm:w-auto"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Share an Item
            </motion.button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search items, categories, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <i className="bi bi-grid me-2"></i>Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                <i className="bi bi-list me-2"></i>List
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="distance">Nearest First</option>
              <option value="rating">Highest Rated</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center justify-center sm:justify-start"
            >
              <i className="bi bi-funnel me-2"></i>
              Filters
              {(selectedCategory !== 'all' || priceRange[0] > 0 || priceRange[1] < 100 || distance < 10 || availability !== 'all') && (
                <span className="ml-2 w-2 h-2 bg-primary-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-4 mb-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>

                {/* Distance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Distance: {distance} miles
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="25"
                    step="0.1"
                    value={distance}
                    onChange={(e) => setDistance(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">All Items</option>
                    <option value="available">Available Now</option>
                    <option value="unavailable">Currently Unavailable</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={clearFilters}
                    className="w-full btn-outline text-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-3 py-2 rounded-xl font-medium whitespace-nowrap transition-all text-sm ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                <i className={`${category.icon} me-2`}></i>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {filteredItems.length} items found
          </p>
        </div>

        {/* Items Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
            : "space-y-4"
          }
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: viewMode === 'grid' ? -8 : 0 }}
              className={`card card-hover overflow-hidden group ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}
            >
              {/* Image */}
              <div className={`relative overflow-hidden ${
                viewMode === 'list' ? 'w-32 sm:w-48 flex-shrink-0' : 'w-full h-48'
              }`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className={`object-cover group-hover:scale-110 transition-transform duration-500 ${
                    viewMode === 'list' ? 'w-full h-full' : 'w-full h-full'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Overlay Actions */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavorite(item.id)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                  >
                    <i className={`bi text-sm ${favorites.has(item.id) ? 'bi-heart-fill text-red-500' : 'bi-heart text-gray-600'}`}></i>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleShare(item)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                  >
                    <i className="bi bi-share text-gray-600 text-sm"></i>
                  </motion.button>
                </div>

                {/* Availability Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-lg leading-tight">
                    {item.title}
                  </h3>
                  <div className="text-right ml-2 flex-shrink-0">
                    <div className="text-sm sm:text-lg font-bold text-primary-600">
                      ${item.price}
                    </div>
                    <div className="text-xs text-gray-500">
                      per {item.period}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
                  {item.tags.slice(0, viewMode === 'list' ? 3 : 2).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Owner Info & Rating */}
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {item.owner.charAt(0)}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 font-medium truncate">
                      {item.owner}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500 flex-shrink-0">
                    <i className="bi bi-star-fill text-yellow-400"></i>
                    <span>{item.rating}</span>
                    <span className="text-xs">({item.reviews})</span>
                  </div>
                </div>

                {/* Distance & Condition */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center">
                    <i className="bi bi-geo-alt me-1"></i>
                    {item.distance} mi away
                  </div>
                  <div className="flex items-center">
                    <i className="bi bi-shield-check me-1"></i>
                    {item.condition}
                  </div>
                </div>

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => item.available ? handleRequestBorrow(item) : null}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-all text-sm ${
                    item.available
                      ? 'bg-primary-500 hover:bg-primary-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!item.available}
                >
                  {item.available ? 'Request to Borrow' : 'Currently Unavailable'}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <i className="bi bi-search text-4xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No items found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Try adjusting your search or filters to find more items
            </p>
            <button onClick={clearFilters} className="btn-outline">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        item={selectedItem}
        currentUser={currentUser}
      />

      <AddItemModal
        isOpen={showAddItemModal}
        onClose={() => setShowAddItemModal(false)}
        currentUser={currentUser}
        onItemAdded={handleAddItem}
      />
    </div>
  );
};

export default Dashboard;