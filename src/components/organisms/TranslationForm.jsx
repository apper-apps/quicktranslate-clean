import React, { useState, useCallback } from 'react'
import Textarea from "@/components/atoms/Textarea";
import LanguageSelector from "@/components/molecules/LanguageSelector";
import ActionButtons from "@/components/molecules/ActionButtons";
import TranslationCard from "@/components/molecules/TranslationCard";
import QuickPhrases from "@/components/molecules/QuickPhrases";
import SpeechRecognizer from "@/components/atoms/SpeechRecognizer";
import { motion } from "framer-motion";
const TranslationForm = ({
  inputText,
  setInputText,
  outputText,
  setOutputText,
  sourceLanguage,
  setSourceLanguage,
  targetLanguage,
  setTargetLanguage,
  languages,
  onTranslate,
  loading,
  quickPhrases
}) => {
  const handleSwapLanguages = () => {
    if (sourceLanguage !== "auto") {
      const temp = sourceLanguage;
      setSourceLanguage(targetLanguage);
      setTargetLanguage(temp);
      
      // Swap text content
      const tempText = inputText;
      setInputText(outputText);
      setOutputText(tempText);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const handlePhraseClick = (phrase) => {
    setInputText(phrase);
  };

  return (
    <div className="space-y-8">
      {/* Language Selectors */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LanguageSelector
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          languages={languages}
          label="From"
        />
        
        <LanguageSelector
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          languages={languages.filter(lang => lang.code !== "auto")}
          label="To"
        />
      </motion.div>

      {/* Translation Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Area */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
<div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Enter text to translate
              </label>
              <SpeechRecognizer 
                onTextReceived={(text) => setInputText(prev => prev ? `${prev} ${text}` : text)}
                className="ml-2"
              />
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your text here or use voice input..."
              className="min-h-[200px] text-base"
            />
          </div>
          
          {/* Quick Phrases */}
          <QuickPhrases
            phrases={quickPhrases}
            onPhraseClick={handlePhraseClick}
          />
        </motion.div>

        {/* Output Area */}
        <TranslationCard
          title="Translation"
          text={outputText}
          placeholder="Translation will appear here..."
          isOutput={true}
          showActions={true}
        />
      </div>

      {/* Action Buttons */}
      <ActionButtons
        onTranslate={onTranslate}
        onSwapLanguages={handleSwapLanguages}
        onClear={handleClear}
        loading={loading}
        canSwap={sourceLanguage !== "auto" && outputText}
        hasText={inputText || outputText}
      />
    </div>
  );
};

export default TranslationForm;