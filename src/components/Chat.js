import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageFilter, setMessageFilter] = useState('all');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const mockChats = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=22c55e&color=fff',
      lastMessage: 'The drill is ready for pickup! 🔧',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      status: 'active',
      itemDiscussed: 'Power Drill'
    },
    {
      id: 2,
      name: 'Mike Chen',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Chen&background=3b82f6&color=fff',
      lastMessage: 'Thanks for the laptop! Great condition 👍',
      timestamp: '1 hour ago',
      unread: 0,
      online: true,
      status: 'completed',
      itemDiscussed: 'MacBook Pro'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=d946ef&color=fff',
      lastMessage: 'When can I return the bike?',
      timestamp: '3 hours ago',
      unread: 1,
      online: false,
      status: 'borrowed',
      itemDiscussed: 'Mountain Bike'
    },
    {
      id: 4,
      name: 'David Park',
      avatar: 'https://ui-avatars.com/api/?name=David+Park&background=f59e0b&color=fff',
      lastMessage: 'Is the mixer still available?',
      timestamp: '1 day ago',
      unread: 0,
      online: false,
      status: 'inquiry',
      itemDiscussed: 'Stand Mixer'
    },
    {
      id: 5,
      name: 'Lisa Wang',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Wang&background=ef4444&color=fff',
      lastMessage: 'Camera works perfectly! 📸',
      timestamp: '2 days ago',
      unread: 0,
      online: true,
      status: 'completed',
      itemDiscussed: 'Canon Camera'
    }
  ];

  const mockMessages = [
    {
      id: 1,
      senderId: 1,
      senderName: 'Sarah Johnson',
      message: 'Hi! I saw you\'re interested in borrowing my power drill.',
      timestamp: '10:30 AM',
      isOwn: false,
      type: 'text',
      status: 'read'
    },
    {
      id: 2,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      message: 'Yes! I need it for a home project this weekend.',
      timestamp: '10:32 AM',
      isOwn: true,
      type: 'text',
      status: 'read'
    },
    {
      id: 3,
      senderId: 1,
      senderName: 'Sarah Johnson',
      message: 'Perfect! It\'s available. When would you like to pick it up?',
      timestamp: '10:33 AM',
      isOwn: false,
      type: 'text',
      status: 'read'
    },
    {
      id: 4,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      message: 'How about tomorrow morning around 9 AM?',
      timestamp: '10:35 AM',
      isOwn: true,
      type: 'text',
      status: 'read'
    },
    {
      id: 5,
      senderId: 1,
      senderName: 'Sarah Johnson',
      message: 'That works perfectly! I\'ll have it ready for you. 🔧',
      timestamp: '10:36 AM',
      isOwn: false,
      type: 'text',
      status: 'read'
    },
    {
      id: 6,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      message: 'Great! Should I bring anything specific?',
      timestamp: '10:38 AM',
      isOwn: true,
      type: 'text',
      status: 'delivered'
    }
  ];

  const emojis = ['😊', '👍', '❤️', '😂', '🔧', '📸', '🚲', '🏠', '✅', '🙏', '👋', '🎉'];

  const quickReplies = [
    'Thanks!',
    'Sounds good',
    'When works for you?',
    'Is it still available?',
    'Perfect timing',
    'Let me know'
  ];

  useEffect(() => {
    if (selectedChat) {
      setMessages(mockMessages);
    }
  }, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredChats = mockChats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chat.itemDiscussed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = messageFilter === 'all' || chat.status === messageFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSendMessage = (messageText = newMessage) => {
    if (!messageText.trim()) return;

    const message = {
      id: Date.now(),
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      message: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);

    // Simulate typing indicator and response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response = {
        id: Date.now() + 1,
        senderId: selectedChat?.id,
        senderName: selectedChat?.name,
        message: 'Got it! I\'ll get back to you soon.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        type: 'text',
        status: 'read'
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const message = {
        id: Date.now(),
        senderId: currentUser?.id,
        senderName: currentUser?.name,
        message: `Shared a file: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        type: 'file',
        fileName: file.name,
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        status: 'sent'
      };
      setMessages(prev => [...prev, message]);
      setShowAttachmentMenu(false);
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleQuickReply = (reply) => {
    handleSendMessage(reply);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'borrowed': return 'bg-yellow-500';
      case 'inquiry': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active Rental';
      case 'completed': return 'Completed';
      case 'borrowed': return 'Currently Borrowed';
      case 'inquiry': return 'Inquiry';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Chat with your neighbors about shared items
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card overflow-hidden flex flex-col"
          >
            {/* Chat List Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Conversations
                </h3>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <i className="bi bi-plus text-gray-600 dark:text-gray-300"></i>
                </button>
              </div>
              
              {/* Search */}
              <div className="relative mb-3">
                <i className="bi bi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {[
                  { id: 'all', name: 'All' },
                  { id: 'active', name: 'Active' },
                  { id: 'inquiry', name: 'Inquiries' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setMessageFilter(filter.id)}
                    className={`flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors ${
                      messageFilter === filter.id
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors ${
                    selectedChat?.id === chat.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {chat.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">
                          {chat.name}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {chat.timestamp}
                          </span>
                          {chat.unread > 0 && (
                            <span className="px-2 py-1 bg-primary-500 text-white text-xs rounded-full min-w-[20px] text-center">
                              {chat.unread}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Re: {chat.itemDiscussed}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(chat.status)}`}>
                          {getStatusText(chat.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Chat Window */}
          <div className="lg:col-span-2">
            {selectedChat ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card h-full flex flex-col"
              >
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedChat.avatar}
                        alt={selectedChat.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {selectedChat.name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {selectedChat.online ? 'Online' : 'Last seen 2 hours ago'}
                          </p>
                          <span className={`w-2 h-2 rounded-full ${selectedChat.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <i className="bi bi-telephone text-gray-600 dark:text-gray-300"></i>
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <i className="bi bi-camera-video text-gray-600 dark:text-gray-300"></i>
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <i className="bi bi-info-circle text-gray-600 dark:text-gray-300"></i>
                      </button>
                    </div>
                  </div>
                  
                  {/* Item Context */}
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <i className="bi bi-box text-primary-600"></i>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Discussing: {selectedChat.itemDiscussed}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(selectedChat.status)}`}>
                        {getStatusText(selectedChat.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-md ${message.isOwn ? 'order-2' : 'order-1'}`}>
                          <div className={`px-4 py-2 rounded-2xl ${
                            message.isOwn
                              ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}>
                            {message.type === 'file' ? (
                              <div className="flex items-center space-x-2">
                                <i className="bi bi-file-earmark text-lg"></i>
                                <div>
                                  <p className="text-sm font-medium">{message.fileName}</p>
                                  <p className="text-xs opacity-75">{message.fileSize}</p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-sm">{message.message}</p>
                            )}
                          </div>
                          <div className={`flex items-center mt-1 space-x-2 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                            <p className={`text-xs ${
                              message.isOwn ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {message.timestamp}
                            </p>
                            {message.isOwn && (
                              <i className={`bi text-xs ${
                                message.status === 'read' ? 'bi-check2-all text-primary-600' :
                                message.status === 'delivered' ? 'bi-check2-all text-gray-400' :
                                'bi-check2 text-gray-400'
                              }`}></i>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                    {quickReplies.map((reply, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm whitespace-nowrap hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="grid grid-cols-6 gap-2">
                        {emojis.map((emoji, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiClick(emoji)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-end space-x-3">
                    {/* Attachment Menu */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <i className="bi bi-paperclip text-gray-600 dark:text-gray-300"></i>
                      </button>
                      
                      {showAttachmentMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-12 left-0 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 min-w-[150px]"
                        >
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                          >
                            <i className="bi bi-file-earmark"></i>
                            <span className="text-sm">File</span>
                          </button>
                          <button
                            onClick={() => toast.success('Photo feature coming soon!')}
                            className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
                          >
                            <i className="bi bi-camera"></i>
                            <span className="text-sm">Photo</span>
                          </button>
                        </motion.div>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <i className="bi bi-emoji-smile text-gray-600 dark:text-gray-300"></i>
                      </button>
                    </div>

                    {/* Send Button */}
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                    >
                      <i className="bi bi-send"></i>
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card h-full flex items-center justify-center"
              >
                <div className="text-center">
                  <i className="bi bi-chat-dots text-6xl text-gray-400 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a chat from the sidebar to start messaging
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="*/*"
      />
    </div>
  );
};

export default Chat;