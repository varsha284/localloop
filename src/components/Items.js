import React, { useState, useEffect } from 'react';
import * as FM from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
const motion = FM; // alias for existing JSX usage

function Items({ socket, currentUser }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    category: 'tools',
    location: '',
    dailyRate: '',
    condition: 'good',
    tags: ''
  });

  const categories = [
    { value: 'tools', label: 'Tools', icon: '🔧' },
    { value: 'kitchen', label: 'Kitchen', icon: '🍳' },
    { value: 'electronics', label: 'Electronics', icon: '📱' },
    { value: 'books', label: 'Books', icon: '📚' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'gardening', label: 'Gardening', icon: '🌱' },
    { value: 'automotive', label: 'Automotive', icon: '🚗' },
    { value: 'furniture', label: 'Furniture', icon: '🪑' },
    { value: 'clothing', label: 'Clothing', icon: '👕' },
    { value: 'toys', label: 'Toys', icon: '🧸' },
    { value: 'other', label: 'Other', icon: '📦' }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    }
    setLoading(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!newItem.name || !newItem.description || !newItem.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const itemData = {
        ...newItem,
        dailyRate: parseFloat(newItem.dailyRate) || 0,
        tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await axios.post('http://localhost:5000/api/items', itemData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setItems([response.data.item, ...items]);
      setNewItem({
        name: '',
        description: '',
        category: 'tools',
        location: '',
        dailyRate: '',
        condition: 'good',
        tags: ''
      });
      setShowAddForm(false);
      toast.success('Item added successfully! 🎉');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.pricing?.dailyRate || 0) - (b.pricing?.dailyRate || 0);
      case 'price-high':
        return (b.pricing?.dailyRate || 0) - (a.pricing?.dailyRate || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const getCategoryIcon = (category) => {
    return categories.find(cat => cat.value === category)?.icon || '📦';
  };

  return (
    <div className="page-items page-container">
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="50" cy="50" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        animation: 'drift 30s linear infinite'
      }}></div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          padding: '3rem 2.5rem',
          marginBottom: '2rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(245, 87, 108, 0.05) 100%)',
            borderRadius: '1.5rem'
          }}></div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  margin: 0,
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  lineHeight: '1.1'
                }}
              >
                🏘️ Community Marketplace
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  margin: '0.75rem 0 0 0',
                  color: '#718096',
                  fontSize: '1.2rem',
                  fontWeight: '500'
                }}
              >
                Discover amazing items shared by your neighbors ✨
              </motion.p>
            </div>
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{
                scale: 1.08,
                boxShadow: '0 15px 35px rgba(102, 126, 234, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '1rem',
                padding: '1.2rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                animation: 'shine 2.5s ease-in-out infinite'
              }}></div>
              <span style={{ position: 'relative', zIndex: 1 }}>
                {showAddForm ? '✕ Cancel' : '+ Share Item'}
              </span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                🔍 Search Items
              </label>
              <input
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                📂 Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                🔄 Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  background: 'white'
                }}
              >
                <option value="newest">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                👁️ View
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.875rem',
                    border: `2px solid ${viewMode === 'grid' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '0.75rem',
                    background: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ⊞
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.875rem',
                    border: `2px solid ${viewMode === 'list' ? '#667eea' : '#e2e8f0'}`,
                    borderRadius: '0.75rem',
                    background: viewMode === 'list' ? 'rgba(102, 126, 234, 0.1)' : 'white',
                    cursor: 'pointer',
                    fontSize: '1.2rem'
                  }}
                >
                  ☰
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div style={{ 
            marginTop: '1rem', 
            padding: '0.75rem 1rem',
            background: 'rgba(102, 126, 234, 0.05)',
            borderRadius: '0.5rem',
            color: '#4a5568',
            fontWeight: '500'
          }}>
            {loading ? 'Loading...' : `${filteredItems.length} items found`}
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory && ` in ${categories.find(c => c.value === selectedCategory)?.label}`}
          </div>
        </div>

        {/* Add Item Form */}
        <FM.AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              style={{
                background: 'white',
                borderRadius: '1rem',
                padding: '2rem',
                marginBottom: '2rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
                📦 Share a New Item
              </h3>
              
              <form onSubmit={handleAddItem}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Item Name *
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                      placeholder="e.g., Power Drill, Camping Tent"
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Category *
                    </label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        background: 'white'
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Daily Rate ($)
                    </label>
                    <input
                      type="number"
                      value={newItem.dailyRate}
                      onChange={(e) => setNewItem({ ...newItem, dailyRate: e.target.value })}
                      placeholder="0 for free"
                      min="0"
                      step="0.01"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Condition
                    </label>
                    <select
                      value={newItem.condition}
                      onChange={(e) => setNewItem({ ...newItem, condition: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '1rem',
                        background: 'white'
                      }}
                    >
                      <option value="new">🆕 New</option>
                      <option value="like-new">✨ Like New</option>
                      <option value="good">👍 Good</option>
                      <option value="fair">👌 Fair</option>
                      <option value="poor">⚠️ Poor</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                    Description *
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Describe your item, its features, and any special instructions..."
                    required
                    rows="4"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1.5rem',
                  marginBottom: '2rem'
                }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Location *
                    </label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                      placeholder="Your neighborhood or area"
                      required
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#4a5568' }}>
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newItem.tags}
                      onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                      placeholder="e.g., cordless, heavy-duty, outdoor"
                      style={{
                        width: '100%',
                        padding: '0.875rem 1rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.75rem',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.75rem',
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(72, 187, 120, 0.4)'
                  }}
                >
                  🚀 Share Item
                </motion.button>
              </form>
            </motion.div>
          )}
        </FM.AnimatePresence>

        {/* Items Grid/List */}
        {loading ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h3>Loading amazing items...</h3>
            <p style={{ color: '#718096' }}>Discovering what your community has to offer</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div style={{
            background: 'white',
            borderRadius: '1rem',
            padding: '4rem',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <h3>No items found</h3>
            <p style={{ color: '#718096', marginBottom: '2rem' }}>
              {searchTerm || selectedCategory 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to share something amazing!'}
            </p>
            {!showAddForm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowAddForm(true)}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.75rem',
                  padding: '1rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                + Share First Item
              </motion.button>
            )}
          </div>
        ) : (
          <div style={{
            display: viewMode === 'grid' 
              ? 'grid' 
              : 'flex',
            gridTemplateColumns: viewMode === 'grid' 
              ? 'repeat(auto-fill, minmax(350px, 1fr))' 
              : 'none',
            flexDirection: viewMode === 'list' ? 'column' : 'row',
            gap: '1.5rem'
          }}>
            {filteredItems.map((item, index) => (
              <motion.div
                key={item._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                style={{
                  background: 'white',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: viewMode === 'list' ? 'flex' : 'block',
                  alignItems: viewMode === 'list' ? 'center' : 'stretch'
                }}
              >
                {/* Item Image */}
                <div style={{
                  height: viewMode === 'grid' ? '200px' : '120px',
                  width: viewMode === 'list' ? '120px' : '100%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'white',
                  flexShrink: 0
                }}>
                  {getCategoryIcon(item.category)}
                </div>

                {/* Item Content */}
                <div style={{
                  padding: '2rem',
                  flex: viewMode === 'list' ? 1 : 'none',
                  position: 'relative'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                    marginBottom: '1rem'
                  }}>
                    <motion.h4
                      style={{
                        margin: 0,
                        fontSize: '1.4rem',
                        fontWeight: '700',
                        color: '#2d3748',
                        lineHeight: '1.3'
                      }}
                    >
                      {item.name}
                    </motion.h4>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.08 }}
                      style={{
                        background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                        color: 'white',
                        padding: '0.4rem 1rem',
                        borderRadius: '2rem',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
                      }}
                    >
                      Available
                    </motion.span>
                  </div>

                  <p style={{
                    color: '#718096',
                    fontSize: '0.95rem',
                    margin: '0 0 1.5rem 0',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: viewMode === 'grid' ? 2 : 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {item.description}
                  </p>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}>
                    <span style={{
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                      color: '#667eea',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '2rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      border: '1px solid rgba(102, 126, 234, 0.2)'
                    }}>
                      {getCategoryIcon(item.category)} {item.category}
                    </span>
                    <div style={{
                      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                      color: '#2d3748',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '2rem',
                      fontSize: '1rem',
                      fontWeight: '800',
                      boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.5)'
                    }}>
                      ${item.pricing?.dailyRate || item.dailyRate || 0}/day
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.9rem',
                    color: '#a0aec0',
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '500'
                  }}>
                    📍 {item.location?.address || item.location}
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '1rem',
                        padding: '1rem 1.5rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                      onClick={() => toast.success(`Request sent for ${item.name}! 📩`)}
                    >
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        animation: 'shine 2s ease-in-out infinite'
                      }}></div>
                      <span style={{ position: 'relative', zIndex: 1 }}>📩 Request</span>
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: '#e2e8f0'
                      }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#4a5568',
                        border: '2px solid #e2e8f0',
                        borderRadius: '1rem',
                        padding: '1rem',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => toast.info(`Starting chat with ${item.owner?.name || 'owner'}! 💬`)}
                    >
                      💬
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Items;