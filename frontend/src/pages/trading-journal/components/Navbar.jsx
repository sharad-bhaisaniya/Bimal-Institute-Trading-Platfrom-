import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Plus, Home, Settings, LogOut } from 'lucide-react';
import { Button } from '../../../components/trading-journal/Button';
import { BASE_URL } from '../../../services/api/api';

const Navbar = ({ user, onLogout, onSettingsClick, isCollapsed }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 right-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-[#222222] transition-all duration-300 ${isCollapsed ? 'left-20' : 'left-64'
        }`}
    >
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">

          {/* Left: Title Area */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">
              Trading <span className="text-primary">Journal</span>
            </h1>
          </div>

          {/* Center: Search Field */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search trades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-dark-surface border border-dark-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Action Stack matched exactly with image_92c923.png */}
          <div className="flex items-center space-x-4">

            {/* Quick Add Button */}
            <Button variant="primary" size="sm" className="animatedBtn">
              <Plus size={16} className="mr-2" />
              Quick Add
            </Button>

            {/* Functional Home Redirect Route Action */}
            <button
              onClick={() => navigate('/')}
              title="Go to Home"
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Home size={18} />
            </button>

            {/* Bell Notification Block Wrapper matching image_92c923.png */}
            <button className="relative p-2.5 bg-[#141414] border border-[#222222] rounded-xl text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full shadow-glow-sm" />
            </button>

            {/* Custom Interactive Trigger Node Components */}
            <button
              onClick={onSettingsClick}
              title="Settings"
              className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Settings size={18} />
            </button>

            <button
              onClick={onLogout}
              title="Logout"
              className="p-2.5 rounded-xl text-gray-400 hover:text-danger hover:bg-white/5 transition-colors"
            >
              <LogOut size={18} />
            </button>

            {/* Solid Structural Border Line Separator Divider element */}
            <div className="h-8 w-[1px] bg-[#222222] mx-1" />

            {/* Consolidated Detailed Profile Metadata Layout Block */}
            <div className="flex items-center space-x-3 pl-1">
              {user?.profileImage ? (
                <img
                  src={user.profileImage.startsWith('http') ? user.profileImage : `${BASE_URL}${user.profileImage}`}
                  alt="Avatar"
                  className="w-9 h-9 rounded-xl object-cover border border-[#222222]"
                />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-primary text-black font-bold flex items-center justify-center text-sm border border-primary/20">
                  {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
              )}

              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white leading-tight">
                  {user?.firstName || 'Super Admin'} {user?.lastName || ''}
                </span>
                <span className="text-xs text-text-muted leading-tight">
                  {user?.role?.name || 'Super Admin'}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;