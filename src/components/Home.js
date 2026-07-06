import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Home({ currentUser }) {
  const stats = { users: 1250, items: 890, transactions: 2340 };
  
  const featuredItems = [
    { id: 1, name: 'Power Drill', description: 'Professional cordless drill', category: 'tools', price: '$12/day' },
    { id: 2, name: 'Camping Tent', description: '4-person waterproof tent', category: 'outdoor', price: '$18/day' },
    { id: 3, name: 'Projector', description: 'HD projector for movies', category: 'electronics', price: '$20/day' },
    { id: 4, name: 'Kayak', description: 'Single-person river kayak', category: 'sports', price: '$30/day' },
    { id: 5, name: 'Guitar', description: 'Acoustic guitar for beginners', category: 'music', price: '$10/day' },
    { id: 6, name: 'Blender', description: 'High-powered kitchen blender', category: 'kitchen', price: '$6/day' }
  ];

  const categories = [
    { name: 'Tools', icon: 'bi-tools', count: 45, color: '#FF6B6B' },
    { name: 'Electronics', icon: 'bi-phone', count: 32, color: '#4ECDC4' },
    { name: 'Sports', icon: 'bi-trophy', count: 28, color: '#45B7D1' },
    { name: 'Books', icon: 'bi-book', count: 67, color: '#96CEB4' },
    { name: 'Kitchen', icon: 'bi-cup-hot', count: 23, color: '#FFEAA7' },
    { name: 'Garden', icon: 'bi-tree', count: 19, color: '#DDA0DD' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Hero Section */}
      <section style={{ padding: '80px 0', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: '4rem', marginBottom: '20px' }}
          >
            <i className="bi bi-house-heart" style={{ color: '#FFD93D' }}></i>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '20px' }}
          >
            Welcome to <span style={{ color: '#FFD93D' }}>LocalLoop</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}
          >
            Share, borrow, and connect with your neighbors. Build community while saving money.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}
          >
            <Link to="/items" style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                  border: 'none',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)'
                }}
              >
                <i className="bi bi-search me-2"></i>
                Browse Items
              </motion.button>
            </Link>
            <Link to={currentUser ? "/items" : "/login"} style={{ textDecoration: 'none' }}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'transparent',
                  border: '2px solid white',
                  padding: '15px 30px',
                  borderRadius: '50px',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                <i className={`bi ${currentUser ? 'bi-plus-circle' : 'bi-person-plus'} me-2`}></i>
                {currentUser ? 'Share Item' : 'Join Now'}
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}
          >
            {[
              { number: stats.users.toLocaleString(), label: 'Members', icon: 'bi-people-fill' },
              { number: stats.items.toLocaleString(), label: 'Items', icon: 'bi-box-seam' },
              { number: stats.transactions.toLocaleString(), label: 'Transactions', icon: 'bi-handshake' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
                  <i className={stat.icon} style={{ color: '#FFD93D' }}></i>
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{stat.number}</div>
                <div style={{ fontSize: '1rem', opacity: 0.9 }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
              Popular Categories
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '500px', margin: '0 auto' }}>
              Discover what your neighbors are sharing
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  background: 'white',
                  padding: '30px',
                  borderRadius: '20px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  border: `3px solid ${category.color}`
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '15px', color: category.color }}>
                  <i className={category.icon}></i>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                  {category.name}
                </h3>
                <p style={{ color: '#666', fontSize: '1rem' }}>{category.count} items</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
              Featured Items
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9 }}>
              Check out these popular items from your community
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {featuredItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{
                  height: '200px',
                  background: `linear-gradient(45deg, ${categories.find(c => c.name.toLowerCase() === item.category)?.color || '#667eea'}, #764ba2)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem',
                  color: 'white'
                }}>
                  <i className={categories.find(c => c.name.toLowerCase() === item.category)?.icon || 'bi-box'}></i>
                </div>
                <div style={{ padding: '25px' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
                    {item.name}
                  </h3>
                  <p style={{ color: '#666', marginBottom: '15px', fontSize: '0.95rem' }}>
                    {item.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
                      color: 'white',
                      padding: '8px 15px',
                      borderRadius: '20px',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      {item.price}
                    </span>
                    <button style={{
                      background: 'transparent',
                      border: '2px solid #667eea',
                      color: '#667eea',
                      padding: '8px 20px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: 'bold'
                    }}>
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', marginBottom: '60px' }}
          >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>
              Why Choose LocalLoop?
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
              Join thousands of neighbors building stronger communities through sharing
            </p>
          </motion.div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px' }}>
            {[
              { icon: 'bi-cash-coin', title: 'Save Money', desc: 'Borrow instead of buying expensive items', color: '#4ECDC4' },
              { icon: 'bi-tree', title: 'Go Green', desc: 'Reduce waste through community sharing', color: '#96CEB4' },
              { icon: 'bi-people', title: 'Build Community', desc: 'Connect with neighbors and make friends', color: '#FF6B6B' },
              { icon: 'bi-shield-check', title: 'Safe & Secure', desc: 'Verified users and secure transactions', color: '#45B7D1' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ textAlign: 'center' }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: feature.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '2rem',
                  color: 'white'
                }}>
                  <i className={feature.icon}></i>
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>
                  {feature.title}
                </h3>
                <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;