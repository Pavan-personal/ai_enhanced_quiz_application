// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Bot, FileText, Book, Sparkles } from "lucide-react";
// import "filepond/dist/filepond.min.css";
// import TopicQuizGenerator from "@/components/TopicQuizGenerator";
// import PDFQuizGenerator from "@/components/PdfQuizGenerator";
// import { LampContainer } from "@/components/lamp";

// const QuizGenerator = () => {
//   const [mode, setMode] = useState("topic");

//   return (
//     <div className="min-h-screen">
//       <LampContainer>
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="min-w-3xl mx-auto p-8 space-y-12"
//         >
//           <motion.div
//             className="flex items-center justify-center space-x-3"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//           >
//             <Bot className="w-8 h-8 text-black" />
//             <h1 className="text-4xl font-bold text-black tracking-tight">
//               MindMesh AI
//             </h1>
//             <Sparkles className="w-6 h-6 text-black" />
//           </motion.div>

//           <div className="flex justify-center space-x-6">
//             {["topic", "pdf"].map((buttonMode) => (
//               <motion.button
//                 key={buttonMode}
//                 onClick={() => setMode(buttonMode)}
//                 className={`relative px-6 py-3 rounded-xl border ${
//                   mode === buttonMode
//                     ? "bg-black text-white border-black"
//                     : "bg-white text-black border-gray-200 hover:border-black"
//                 } transition-colors duration-200`}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div className="flex items-center space-x-2">
//                   {buttonMode === "pdf" ? (
//                     <FileText className="w-5 h-5" />
//                   ) : (
//                     <Book className="w-5 h-5" />
//                   )}
//                   <span className="capitalize">{buttonMode} Based</span>
//                 </div>
//               </motion.button>
//             ))}
//           </div>

//           <motion.div className="bg-white rounded-2xl shadow-lg p-8" layout>
//             <div className="space-y-8">
//               <AnimatePresence mode="wait">
//                 {mode === "topic" ? (
//                   <TopicQuizGenerator key="topic" />
//                 ) : (
//                   <PDFQuizGenerator key="pdf" />
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         </motion.div>
//       </LampContainer>
//     </div>
//   );
// };

// export default QuizGenerator;
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, FileText, Book, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import "filepond/dist/filepond.min.css";
import TopicQuizGenerator from "@/components/TopicQuizGenerator";
import PDFQuizGenerator from "@/components/PdfQuizGenerator";

const LampEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Main lamp light beam */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="absolute left-1/2 -translate-x-1/2 -top-40"
      >
        {/* Central beam */}
        <div className="relative">
          <motion.div
            animate={{
              opacity: [0.5, 0.6, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-[500px] h-[600px] bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent"
            style={{
              clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
            }}
          />
          
          {/* Lamp head */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-40 h-16 bg-cyan-600/20 rounded-full blur-md" />
          
          {/* Light source */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_40px_20px_rgba(34,211,238,0.3)]" />
        </div>
      </motion.div>

      {/* Side beams */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[500px]"
        >
          {/* Left beam */}
          <div className="absolute left-0 top-0 w-1/2 h-full bg-gradient-conic from-cyan-500/40 via-transparent to-transparent [--conic-position:from_70deg_at_center_top]" style={{ transform: 'scale(1.2)' }}>
            <div className="absolute w-full h-full bg-slate-950/90 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </div>

          {/* Right beam */}
          <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-conic from-transparent via-transparent to-cyan-500/40 [--conic-position:from_290deg_at_center_top]" style={{ transform: 'scale(1.2)' }}>
            <div className="absolute w-full h-full bg-slate-950/90 [mask-image:linear-gradient(to_left,white,transparent)]" />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const QuizGenerator = () => {
  const [mode, setMode] = useState("topic");

  return (
    <div className="relative min-h-screen w-full bg-slate-950">
      <LampEffect />
      
      <div className="relative z-10 pt-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto max-w-4xl px-4 space-y-12"
        >
          {/* Header */}
          <motion.div
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Bot className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold text-white tracking-tight">
              MindMesh AI
            </h1>
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>

          {/* Mode Selection */}
          <div className="flex justify-center space-x-6">
            {["topic", "pdf"].map((buttonMode) => (
              <motion.button
                key={buttonMode}
                onClick={() => setMode(buttonMode)}
                className={cn(
                  "group relative px-8 py-4 rounded-xl border-2 transition-all duration-200",
                  "flex items-center justify-center min-w-[160px]",
                  mode === buttonMode
                    ? "bg-white text-slate-950 border-white"
                    : "bg-transparent text-white border-white/20 hover:border-white/60"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center space-x-3">
                  {buttonMode === "pdf" ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Book className="w-5 h-5" />
                  )}
                  <span className="capitalize font-medium">
                    {buttonMode} Based
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Content Area */}
          <motion.div 
            className="bg-white/[0.08] backdrop-blur-xl rounded-2xl overflow-hidden"
            layout
          >
            <div className="p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {mode === "topic" ? <TopicQuizGenerator /> : <PDFQuizGenerator />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default QuizGenerator;