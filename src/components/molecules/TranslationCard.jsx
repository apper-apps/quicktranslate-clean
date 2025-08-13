import React, { useState, useCallback } from 'react'
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const TranslationCard = ({ 
  title, 
  text, 
  placeholder, 
  isOutput = false, 
  onCopy, 
  onClear,
  showActions = true 
}) => {
const handleCopy = async () => {
    if (text && text.trim()) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Text copied to clipboard!");
        onCopy && onCopy();
      } catch (error) {
        toast.error("Failed to copy text");
      }
    }
  };

  const handleSpeak = () => {
    if (text && text.trim()) {
      try {
        // Check if speech synthesis is supported
        if ('speechSynthesis' in window) {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();
          
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.8;
          utterance.pitch = 1;
          utterance.volume = 1;
          
          window.speechSynthesis.speak(utterance);
          toast.success("Speaking text...");
        } else {
          toast.error("Text-to-speech not supported in your browser");
        }
      } catch (error) {
        toast.error("Failed to speak text");
      }
    }
  };

  const handleClear = () => {
    onClear && onClear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {showActions && (
<div className="flex gap-2">
                {isOutput && text && text.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSpeak}
                    className="h-8 px-3"
                    title="Listen to pronunciation"
                  >
                    <ApperIcon name="Volume2" className="h-4 w-4" />
                  </Button>
                )}
                {text && text.trim() && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 px-3"
                  >
                    <ApperIcon name="Copy" className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                )}
                {!isOutput && onClear && text && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 px-3"
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div 
            className={`min-h-[120px] p-4 rounded-lg border ${
              isOutput 
                ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200" 
                : "bg-gray-50 border-gray-200"
            } flex items-start`}
          >
            {text ? (
              <p className="text-base text-gray-900 leading-relaxed whitespace-pre-wrap">
                {text}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                {placeholder}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TranslationCard;