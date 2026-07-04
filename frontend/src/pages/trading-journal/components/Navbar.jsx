import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, User, Plus } from 'lucide-react';
import { Button } from '../../../components/trading-journal/Button';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-[#0#0a0a]a]/80 backdrop-blur-xl border-b borde[#222222]"
    >
      <div className="px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-white">
              Trading <span className="text-primary">Journal</span>
            </h1>
          </div>

          {/* Center: Search */}
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

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="sm" className="hidden sm:flex">
              <Plus size={16} className="mr-2" />
              Quick Add
            </Button>
            
            <button className="relative p-2 rounded-xl hover:bg-dark-surface text-gray-400 hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            
            <button className="flex items-center space-x-2 p-2 rounded-xl hover:bg-dark-surface transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                <User size={14} className="text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
