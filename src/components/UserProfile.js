import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UserProfile = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'bi-person' },
    { id: 'items', name: 'My Items', icon: 'bi-box' },
    { id: 'history', name: 'History', icon: 'bi-clock-history' },
    { id: 'reviews', name: 'Reviews', icon: 'bi-star' },
    { id: 'settings', name: 'Settings', icon: 'bi-gear' }
  ];

  const userStats = [
    { label: 'Items Shared', value: 12, icon: 'bi-box', color: 'text-blue-600' },
    { label: 'Items Borrowed', value: 8, icon: 'bi-arrow-down-circle', color: 'text-green-600' },
    { label: 'Transactions', value: 28, icon: 'bi-arrow-repeat', color: 'text-purple-600' },
    { label: 'Trust Score', value: '4.8/5', icon: 'bi-shield-check', color: 'text-orange-600' }
  ];

  const recentActivity = [
    { id: 1, action: 'Borrowed', item: 'Power Drill', from: 'Sarah Johnson', date: '2 days ago', status: 'completed' },
    { id: 2, action: 'Shared', item: 'Camera', to: 'Mike Chen', date: '1 week ago', status: 'active' },
    { id: 3, action: 'Returned', item: 'Lawn Mower', to: 'Emily Rodriguez', date: '2 weeks ago', status: 'completed' }
  ];

  const reviews = [
    {
      id: 1,
      reviewer: 'Sarah Johnson',
      rating: 5,
      comment: 'Great neighbor! Very responsible with borrowed items.',
      date: '1 week ago',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=22c55e&color=fff'
    },
    {
      id: 2,
      reviewer: 'Mike Chen',
      rating: 5,
      comment: 'Excellent communication and took great care of my camera.',
      date: '2 weeks ago',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=3b82f6&color=fff'
    }
  ];

  const CircularProgress = ({ percentage, size = 120, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-gray-200 dark:text-gray-700"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-primary-500"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {percentage}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <img
                src={currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=22c55e&color=fff&size=120`}
                alt={currentUser?.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full flex items-center justify-center">
                <i className="bi bi-check text-white text-sm"></i>
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentUser?.name}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                {currentUser?.location || 'San Francisco, CA'}
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Member since January 2024
              </p>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <i className="bi bi-shield-check me-1"></i>
                  Verified
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  <i className="bi bi-star-fill me-1"></i>
                  Top Contributor
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="btn-outline"
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Profile
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                <i className="bi bi-share me-2"></i>
                Share Profile
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {userStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="card p-6 text-center"
            >
              <div className={`text-3xl mb-3 ${stat.color}`}>
                <i className={stat.icon}></i>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <i className={`${tab.icon} me-2`}></i>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Trust Score */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Trust Score
                </h3>
                <div className="flex flex-col items-center">
                  <CircularProgress percentage={96} />
                  <div className="mt-4 text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      4.8/5.0
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Based on 15 reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <i className={`bi ${activity.action === 'Borrowed' ? 'bi-arrow-down' : activity.action === 'Shared' ? 'bi-arrow-up' : 'bi-check'}`}></i>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.action} {activity.item}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.action === 'Borrowed' ? `from ${activity.from}` : `to ${activity.to}`} • {activity.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        activity.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Reviews & Ratings
              </h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="flex space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <img
                      src={review.avatar}
                      alt={review.reviewer}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {review.reviewer}
                        </h4>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bi bi-star${i < review.rating ? '-fill' : ''} text-yellow-400`}
                            ></i>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-2">
                        {review.comment}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {review.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'items' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                My Shared Items
              </h3>
              <div className="text-center py-12">
                <i className="bi bi-box text-6xl text-gray-400 mb-4"></i>
                <h4 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No items shared yet
                </h4>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start sharing items with your community
                </p>
                <button className="btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Item
                </button>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Transaction History
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <i className={`bi ${activity.action === 'Borrowed' ? 'bi-arrow-down' : 'bi-arrow-up'}`}></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {activity.item}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {activity.action} • {activity.date}
                        </p>
                      </div>
                    </div>
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Account Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Notifications
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Email notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Push notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">SMS notifications</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                    Privacy
                  </h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Show profile to public</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">Allow direct messages</span>
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;