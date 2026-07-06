import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveMap = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [mapItems, setMapItems] = useState([]);

  const mockMapItems = [
    {
      id: 1,
      title: 'Power Drill',
      owner: 'Sarah Johnson',
      price: 15,
      lat: 37.7749,
      lng: -122.4194,
      category: 'tools',
      available: true
    },
    {
      id: 2,
      title: 'MacBook Pro',
      owner: 'Mike Chen',
      price: 50,
      lat: 37.7849,
      lng: -122.4094,
      category: 'electronics',
      available: true
    },
    {
      id: 3,
      title: 'Mountain Bike',
      owner: 'Emily Rodriguez',
      price: 25,
      lat: 37.7649,
      lng: -122.4294,
      category: 'sports',
      available: false
    }
  ];

  useEffect(() => {
    setMapItems(mockMapItems);
  }, []);

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Interactive Map
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover items near you on the map
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Container */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card h-96 lg:h-[600px] relative overflow-hidden"
            >
              {/* Placeholder Map */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 flex items-center justify-center">
                <div className="text-center">
                  <i className="bi bi-map text-6xl text-gray-400 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Interactive Map View
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Leaflet map integration coming soon
                  </p>
                </div>
              </div>

              {/* Mock Map Markers */}
              {mapItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute cursor-pointer"
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-lg ${
                    item.available ? 'bg-green-500' : 'bg-red-500'
                  }`}>
                    <i className="bi bi-geo-alt-fill text-sm"></i>
                  </div>
                  {selectedItem?.id === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 min-w-48 z-10"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        by {item.owner}
                      </p>
                      <p className="text-sm font-medium text-primary-600">
                        ${item.price}/day
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Map Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Radius
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option>1 mile</option>
                    <option>2 miles</option>
                    <option>5 miles</option>
                    <option>10 miles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    <option>All Categories</option>
                    <option>Tools</option>
                    <option>Electronics</option>
                    <option>Sports</option>
                    <option>Kitchen</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Available now</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Available soon</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Nearby Items */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Nearby Items
              </h3>
              
              <div className="space-y-3">
                {mapItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className={`w-3 h-3 rounded-full ${
                      item.available ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.owner}
                      </p>
                    </div>
                    <div className="text-sm font-medium text-primary-600">
                      ${item.price}/day
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Map Legend */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Map Legend
              </h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Available items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Unavailable items</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">Your location</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;