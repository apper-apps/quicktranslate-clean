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
            <div className="p-2 bg-gradient-to-r from-google-blue to-blue-600 rounded-lg">
              <ApperIcon name="Languages" className="h-6 w-6 text-white" />
            </div>
            <div>
<h1 className="text-2xl font-bold text-gradient">
                RL Mera Translate
              </h1>
              <p className="text-sm text-gray-500 -mt-1">
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