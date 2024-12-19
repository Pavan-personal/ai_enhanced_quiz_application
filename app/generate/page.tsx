"use client";
// v1

// import React, { useState } from 'react';
// import { FilePond } from 'react-filepond';
// import { motion } from 'framer-motion';
// import { Loader2, FileText, Book, ChevronRight, Search, Settings } from 'lucide-react';

// const QuizGenerator = () => {
//   const [mode, setMode] = useState('');
//   const [keyword, setKeyword] = useState('');
//   const [topics, setTopics] = useState([]);
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [settings, setSettings] = useState({
//     difficulty: 'medium',
//     numberOfQuestions: 10,
//     questionLength: 'short'
//   });
//   const [serverResponse, setServerResponse] = useState('');

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`/api/generate-topics?keyword=${keyword}`);
//       const data = await response.json();
//       setTopics(data.keywords);
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   const generateQuestions = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/topic-based-generation', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           command: 'generate mcq questions',
//           topics: selectedTopics,
//           ...settings
//         }),
//       });
//       const data = await response.json();
//       console.log(data);
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="max-w-4xl mx-auto space-y-8"
//       >
//         <div className="flex space-x-4 justify-center">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setMode('pdf')}
//             className={`flex items-center space-x-2 px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r ${mode === 'pdf' ? 'from-blue-500 to-indigo-600 text-white' : 'from-white to-gray-50 text-gray-700'}`}
//           >
//             <FileText className="w-5 h-5" />
//             <span>PDF Based</span>
//           </motion.button>
          
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => setMode('topic')}
//             className={`flex items-center space-x-2 px-6 py-4 rounded-xl shadow-lg bg-gradient-to-r ${mode === 'topic' ? 'from-blue-500 to-indigo-600 text-white' : 'from-white to-gray-50 text-gray-700'}`}
//           >
//             <Book className="w-5 h-5" />
//             <span>Topic Based</span>
//           </motion.button>
//         </div>

//         <motion.div
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: mode ? 1 : 0, height: mode ? 'auto' : 0 }}
//           className="bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
//         >
//           {mode === 'pdf' && (
//             <motion.div initial={{ x: -20 }} animate={{ x: 0 }}>
//               <FilePond
//                 server={{
//                   process: "/api/upload-pdf",
//                   fetch: null,
//                   revert: null,
//                 }}
//                 onprocessfile={(error, file) => {
//                   if (!error) {
//                     setServerResponse(JSON.parse(file.serverId).textChunk);
//                   }
//                 }}
//                 className="border-2 border-dashed border-gray-200 rounded-xl p-4"
//               />
//             </motion.div>
//           )}

//           {mode === 'topic' && (
//             <motion.div initial={{ x: 20 }} animate={{ x: 0 }} className="space-y-6">
//               <div className="flex space-x-2">
//                 <input
//                   type="text"
//                   value={keyword}
//                   onChange={(e) => setKeyword(e.target.value)}
//                   placeholder="Enter a topic..."
//                   className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
//                 />
//                 <motion.button
//                   whileHover={{ scale: 1.05 }}
//                   whileTap={{ scale: 0.95 }}
//                   onClick={handleSearch}
//                   className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg flex items-center space-x-2"
//                 >
//                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
//                   <span>Search</span>
//                 </motion.button>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 {topics.map((topic, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: index * 0.1 }}
//                   >
//                     <motion.button
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => setSelectedTopics(prev => 
//                         prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
//                       )}
//                       className={`px-3 py-1 rounded-full text-sm ${
//                         selectedTopics.includes(topic)
//                           ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
//                           : 'bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       {topic}
//                     </motion.button>
//                   </motion.div>
//                 ))}
//               </div>
//             </motion.div>
//           )}

//           {(serverResponse || selectedTopics.length > 0) && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-6 space-y-4"
//             >
//               <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center space-x-2">
//                   <Settings className="w-5 h-5 text-gray-500" />
//                   <span className="text-gray-700">Quiz Settings</span>
//                 </div>
//                 <div className="flex space-x-4">
//                   <select
//                     value={settings.difficulty}
//                     onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
//                     className="px-3 py-1 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
//                   >
//                     <option value="easy">Easy</option>
//                     <option value="medium">Medium</option>
//                     <option value="hard">Hard</option>
//                   </select>
//                   <input
//                     type="number"
//                     value={settings.numberOfQuestions}
//                     onChange={(e) => setSettings(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
//                     className="w-20 px-3 py-1 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
//                     min="1"
//                     max="20"
//                   />
//                 </div>
//               </div>

//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 onClick={generateQuestions}
//                 className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center space-x-2 shadow-lg"
//               >
//                 {loading ? (
//                   <Loader2 className="w-5 h-5 animate-spin" />
//                 ) : (
//                   <>
//                     <span>Generate Quiz</span>
//                     <ChevronRight className="w-5 h-5" />
//                   </>
//                 )}
//               </motion.button>
//             </motion.div>
//           )}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// };

// export default QuizGenerator;


// v2 

// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Bot, FileText, Book, Search, Settings, 
//   X, Loader2, Send, Sparkles
// } from 'lucide-react';

// const QuizGenerator = () => {
//   const [mode, setMode] = useState('');
//   const [keyword, setKeyword] = useState('');
//   const [topics, setTopics] = useState([]);
//   const [selectedTopics, setSelectedTopics] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [loadingText, setLoadingText] = useState('');
//   const [settings, setSettings] = useState({
//     difficulty: 'medium',
//     numberOfQuestions: 10,
//     style: 'classic'
//   });
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     if (loading) {
//       const texts = ["Analyzing topics...", "Generating questions...", "Applying AI magic...", "Almost ready..."];
//       let i = 0;
//       const interval = setInterval(() => {
//         setLoadingText(texts[i % texts.length]);
//         i++;
//       }, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [loading]);

//   const handleSearch = async () => {
//     setLoading(true);
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   const generateQuestions = async () => {
//     setLoading(true);
//     try {
//       await new Promise(resolve => setTimeout(resolve, 3000));
//       // setMessages(prev => [...prev, {
//       //   type: 'assistant',
//       //   content: `I've generated a quiz based on ${selectedTopics.join(', ')}. Would you like to start?`
//       // }]);
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-white text-black">
//       <motion.div 
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         className="max-w-4xl mx-auto p-8 space-y-12"
//       >
//         <motion.div 
//           className="flex items-center justify-center space-x-3"
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           <Bot className="w-8 h-8" />
//           <h1 className="text-4xl font-light tracking-tight">Quiz Generator</h1>
//           <Sparkles className="w-6 h-6" />
//         </motion.div>

//         <div className="flex justify-center space-x-6">
//           {['pdf', 'topic'].map((buttonMode) => (
//             <motion.button
//               key={buttonMode}
//               onClick={() => setMode(buttonMode)}
//               className={`relative px-8 py-4 rounded-lg border ${
//                 mode === buttonMode 
//                   ? 'bg-black text-white border-black' 
//                   : 'bg-white text-black border-gray-200 hover:border-black'
//               } transition-colors duration-200`}
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="flex items-center space-x-2">
//                 {buttonMode === 'pdf' ? (
//                   <FileText className="w-5 h-5" />
//                 ) : (
//                   <Book className="w-5 h-5" />
//                 )}
//                 <span className="font-light">{buttonMode === 'pdf' ? 'PDF Based' : 'Topic Based'}</span>
//               </div>
//             </motion.button>
//           ))}
//         </div>

//         <AnimatePresence mode="wait">
//           {mode && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="space-y-8"
//             >
//               {mode === 'topic' && (
//                 <div className="space-y-6">
//                   <div className="flex space-x-2">
//                     <input
//                       type="text"
//                       value={keyword}
//                       onChange={(e) => setKeyword(e.target.value)}
//                       placeholder="Enter a topic..."
//                       className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-black outline-none transition-colors duration-200"
//                     />
//                     <motion.button
//                       onClick={handleSearch}
//                       disabled={loading}
//                       className="px-6 py-3 bg-black text-white rounded-lg flex items-center space-x-2 disabled:opacity-50"
//                       whileHover={{ scale: 1.02 }}
//                       whileTap={{ scale: 0.98 }}
//                     >
//                       {loading ? (
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                       ) : (
//                         <Search className="w-5 h-5" />
//                       )}
//                       <span className="font-light">Search</span>
//                     </motion.button>
//                   </div>

//                   <div className="flex flex-wrap gap-2">
//                     <AnimatePresence>
//                       {topics.map((topic, index) => (
//                         <motion.button
//                           key={topic}
//                           initial={{ opacity: 0, scale: 0.8 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           exit={{ opacity: 0, scale: 0.8 }}
//                           transition={{ delay: index * 0.05 }}
//                           onClick={() => setSelectedTopics(prev => 
//                             prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
//                           )}
//                           className={`px-4 py-2 rounded-full border ${
//                             selectedTopics.includes(topic)
//                               ? 'bg-black text-white border-black'
//                               : 'bg-white text-black border-gray-200 hover:border-black'
//                           } transition-colors duration-200 flex items-center space-x-2`}
//                         >
//                           <span className="font-light">{topic}</span>
//                           {selectedTopics.includes(topic) && (
//                             <X className="w-4 h-4" />
//                           )}
//                         </motion.button>
//                       ))}
//                     </AnimatePresence>
//                   </div>
//                 </div>
//               )}

//               {selectedTopics.length > 0 && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className="space-y-6 border rounded-xl p-6"
//                 >
//                   <div className="flex items-center space-x-2">
//                     <Settings className="w-5 h-5" />
//                     <span className="text-lg font-light">Quiz Settings</span>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <select
//                       value={settings.difficulty}
//                       onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
//                       className="px-4 py-3 rounded-lg border border-gray-200 focus:border-black outline-none transition-colors duration-200"
//                     >
//                       <option value="easy">Easy</option>
//                       <option value="medium">Medium</option>
//                       <option value="hard">Hard</option>
//                     </select>

//                     <select
//                       value={settings.style}
//                       onChange={(e) => setSettings(prev => ({ ...prev, style: e.target.value }))}
//                       className="px-4 py-3 rounded-lg border border-gray-200 focus:border-black outline-none transition-colors duration-200"
//                     >
//                       <option value="classic">Classic</option>
//                       <option value="modern">Modern</option>
//                       <option value="challenging">Challenging</option>
//                     </select>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm text-gray-600">
//                       <span>Number of Questions</span>
//                       <span>{settings.numberOfQuestions}</span>
//                     </div>
//                     <input
//                       type="range"
//                       min="1"
//                       max="20"
//                       value={settings.numberOfQuestions}
//                       onChange={(e) => setSettings(prev => ({ ...prev, numberOfQuestions: parseInt(e.target.value) }))}
//                       className="w-full"
//                     />
//                   </div>

//                   <motion.button
//                     onClick={generateQuestions}
//                     disabled={loading}
//                     className="w-full py-4 bg-black text-white rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
//                     whileHover={{ scale: 1.02 }}
//                     whileTap={{ scale: 0.98 }}
//                   >
//                     {loading ? (
//                       <div className="flex items-center space-x-2">
//                         <Loader2 className="w-5 h-5 animate-spin" />
//                         <span className="font-light">{loadingText}</span>
//                       </div>
//                     ) : (
//                       <div className="flex items-center space-x-2">
//                         <Send className="w-5 h-5" />
//                         <span className="font-light">Generate Quiz</span>
//                       </div>
//                     )}
//                   </motion.button>
//                 </motion.div>
//               )}

//               <AnimatePresence>
//                 {messages.map((message: any, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     className="p-4 border rounded-lg bg-gray-50"
//                   >
//                     <p className="font-light">{message.content}</p>
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </motion.div>
//     </div>
//   );
// };

// export default QuizGenerator;

// v3

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextField } from '@mui/material';
import { 
  Bot, FileText, Book, Search, Settings, 
  X, Loader2, Send, Sparkles, ChevronRight
} from 'lucide-react';
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

// PDF-based Quiz Component
const PDFQuizGenerator = () => {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  
  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/pdf-based-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: "generate 10 mcq questions from the following text in format of {question: 'string', answer: 'string', options: ['string', 'string', 'string', 'string']}",
          description: serverResponse?.replace(/\n/g, " "),
        }),
      });
      const data = await response.json();
      setQuestions(data?.formattedJson);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-6"
    >
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
      />
      
      {serverResponse && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleGenerateQuiz}
          className="w-full py-4 bg-black text-white rounded-xl flex items-center justify-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Generate Quiz</span>
            </>
          )}
        </motion.button>
      )}

      {questions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Render questions here */}
        </motion.div>
      )}
    </motion.div>
  );
};

// Topic-based Quiz Component
const TopicQuizGenerator = () => {
  const [keyword, setKeyword] = useState('');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [settings, setSettings] = useState({
    difficulty: 'medium',
    numberOfQuestions: 10,
    style: 'classic'
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/generate-topics?keyword=${encodeURIComponent(keyword)}`);
      const data = await response.json();
      setTopics(data.keywords || []);
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

  useEffect(() => {
    if (loading) {
      const texts = ["Analyzing topics...", "Generating questions...", "Applying AI magic..."];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-6"
    >
      <div className="space-y-4">
        <TextField
          fullWidth
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a topic..."
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
              backgroundColor: 'white',
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              <motion.button
                onClick={handleSearch}
                disabled={loading}
                className="px-4 py-2 bg-black text-white rounded-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Search className="w-5 h-5" />
                )}
              </motion.button>
            ),
          }}
        />

        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {topics.map((topic, index) => (
              <motion.button
                key={topic}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedTopics(prev => 
                  prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                )}
                className={`px-4 py-2 rounded-full border ${
                  selectedTopics.includes(topic)
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200 hover:border-black'
                } transition-all duration-200`}
              >
                {topic}
                {selectedTopics.includes(topic) && (
                  <X className="w-4 h-4 ml-2 inline" />
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {selectedTopics.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <motion.button
            onClick={generateQuestions}
            disabled={loading}
            className="w-full py-4 bg-black text-white rounded-xl flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{loadingText}</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Generate Quiz</span>
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Main Component
const QuizGenerator = () => {
  const [mode, setMode] = useState('topic');

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
          <Bot className="w-8 h-8" />
          <h1 className="text-4xl font-light tracking-tight">AI Quiz Generator</h1>
          <Sparkles className="w-6 h-6" />
        </motion.div>

        <div className="flex justify-center space-x-6">
          {['topic', 'pdf'].map((buttonMode) => (
            <motion.button
              key={buttonMode}
              onClick={() => setMode(buttonMode)}
              className={`relative px-6 py-3 rounded-xl border ${
                mode === buttonMode 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-gray-200 hover:border-black'
              } transition-colors duration-200`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-2">
                {buttonMode === 'pdf' ? (
                  <FileText className="w-5 h-5" />
                ) : (
                  <Book className="w-5 h-5" />
                )}
                <span className="capitalize">{buttonMode} Based</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="bg-white rounded-2xl shadow-lg p-8"
          layout
        >
          <AnimatePresence mode="wait">
            {mode === 'topic' ? (
              <TopicQuizGenerator key="topic" />
            ) : (
              <PDFQuizGenerator key="pdf" />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QuizGenerator;