"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, FileText, Book, Sparkles } from "lucide-react";
import "filepond/dist/filepond.min.css";
import TopicQuizGenerator from "@/components/TopicQuizGenerator";
import PDFQuizGenerator from "@/components/PdfQuizGenerator";

const QuizGenerator = () => {
  const [mode, setMode] = useState("topic");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto p-8 space-y-12"
      >
        <motion.div
          className="flex items-center justify-center space-x-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Bot className="w-8 h-8 text-black" />
          <h1 className="text-4xl font-bold text-black tracking-tight">
            MindMesh AI
          </h1>
          <Sparkles className="w-6 h-6 text-black" />
        </motion.div>

        <div className="flex justify-center space-x-6">
          {["topic", "pdf"].map((buttonMode) => (
            <motion.button
              key={buttonMode}
              onClick={() => setMode(buttonMode)}
              className={`relative px-6 py-3 rounded-xl border ${
                mode === buttonMode
                  ? "bg-black text-white border-black"
                  : "bg-white text-black border-gray-200 hover:border-black"
              } transition-colors duration-200`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                {buttonMode === "pdf" ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <Book className="w-5 h-5" />
                )}
                <span className="capitalize">{buttonMode} Based</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div className="bg-white rounded-2xl shadow-lg p-8" layout>
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              {mode === "topic" ? (
                <TopicQuizGenerator key="topic" />
              ) : (
                <PDFQuizGenerator key="pdf" />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizGenerator;
