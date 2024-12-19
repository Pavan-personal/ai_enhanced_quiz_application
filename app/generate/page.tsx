"use client";
import React, { useState } from 'react';
import { FilePond } from 'react-filepond';
import { motion } from 'framer-motion';
import { Loader2, FileText, Book, ChevronRight, Search, Settings } from 'lucide-react';

const QuizGenerator = () => {
  const [mode, setMode] = useState('');
  const [keyword, setKeyword] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    difficulty: 'medium',
    numberOfQuestions: 10,
    questionLength: 'short'
  });
  const [serverResponse, setServerResponse] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/generate-topics?keyword=${keyword}`);
      const data = await response.json();
      setTopics(data.keywords);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const generateQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/topic-based-generation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          command: 'generate mcq questions',
          topics: selectedTopics,
          ...settings
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="flex space-x-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('pdf')}
            className={`flex items-center space-x-2 px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r ${mode === 'pdf' ? 'from-blue-500 to-indigo-600 text-white' : 'from-white to-gray-50 text-gray-700'}`}
          >
            <FileText className="w-5 h-5" />
            <span>PDF Based</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode('topic')}
            className={`flex items-center space-x-2 px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r ${mode === 'topic' ? 'from-blue-500 to-indigo-600 text-white' : 'from-white to-gray-50 text-gray-700'}`}
          >
            <Book className="w-5 h-5" />
            <span>Topic Based</span>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: mode ? 1 : 0, height: mode ? 'auto' : 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
        >
          {mode === 'pdf' && (
            <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
              <FilePond
                server={{
                  process: "/api/upload-pdf",
                  fetch: null,
                  revert: null,
                }}
                onprocessfile={(error, file) => {
                  if (!error) {
                    setServerResponse(JSON.parse(file.serverId).textChunk);
                  }
                }}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4"
              />
            </motion.div>
          )}

          {mode === 'topic' && (
            <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter a topic..."
                  className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center space-x-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  <span>Search</span>
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-2">
                {topics.map((topic, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTopics(prev => 
                        prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                      )}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTopics.includes(topic)
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {topic}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {(serverResponse || selectedTopics.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Quiz Settings</span>
                </div>
                <div className="flex space-x-4">
                  <select
                    value={settings.difficulty}
                    onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="px-3 py-1 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                  <input
                    type="number"
                    value={settings.numberOfQuestions}
                    onChange={(e) => setSettings(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-1 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                    min="1"
                    max="20"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateQuestions}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center space-x-2 shadow-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Generate Quiz</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizGenerator;