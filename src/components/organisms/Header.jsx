import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Header = () => {
  return (
    <motion.header 
      className="bg-white border-b border-gray-200 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex items-center space-x-3">
<motion.div 
              className="p-3 bg-gradient-to-br from-google-blue via-blue-500 to-google-green rounded-xl shadow-google"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <ApperIcon name="Languages" className="h-8 w-8 text-white drop-shadow-sm" />
            </motion.div>
            <div className="ml-1">
              <motion.h1 
                className="text-3xl font-bold text-gradient tracking-tight"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                RL Mera Translate
              </motion.h1>
              <p className="text-sm font-medium text-gray-600 -mt-1 tracking-wide">
                Fast & Accurate Translation
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;