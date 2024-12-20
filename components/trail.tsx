import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { Progress } from "@/components/ui/progress";
// import { Card, CardContent } from "@/components/ui/card";
import { Check, X, AlertTriangle, Lock } from "lucide-react";
import { Card, CardContent } from '@mui/material';

const QuizDialog = () => {
  const [demoText, setDemoText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  interface Question {
    question: string;
    options: string[];
    answer: number;
  }
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<{ error: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/trail?context=${encodeURIComponent(demoText)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data);
        setIsGenerating(false);
        return;
      }
      
      if (data.questions) {
        setQuestions(data.questions);
        setShowQuiz(true);
        setSelectedAnswers(new Array(data.questions.length).fill(null));
      }
    } catch (error) {
      setError({ error: "Something went wrong. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number

  ) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    return questions.reduce((score, question, index) => {
      return score + (selectedAnswers[index] === question.answer ? 1 : 0);
    }, 0);
  };

  const renderRateLimitError = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => setError(null)}
    >
      <Card className="max-w-md w-full bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-yellow-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rate Limit Exceeded</h3>
            <p className="text-gray-600 mb-6">
              Upgrade your plan to generate unlimited questions and access premium features.
            </p>
            <div className="space-x-4">
              <motion.button
                className="px-6 py-2 bg-purple-600 text-black rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add your upgrade navigation logic here
                }}
              >
                Upgrade Now
              </motion.button>
              <motion.button
                className="px-6 py-2 border border-gray-300 rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add your register navigation logic here
                }}
              >
                Register
              </motion.button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <>
      <div className="max-w-3xl mx-auto mb-20">
        <h2 className="text-4xl font-bold text-center mb-8">Try It Now</h2>
        <div className="bg-gray-900 rounded-xl p-6">
          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            className="w-full h-32 bg-gray-800 rounded-lg p-4 text-black mb-4"
            placeholder="Paste your content or enter a topic..."
          />
          <motion.button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
          >
            {isGenerating ? 'Generating...' : 'Generate Questions'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {showQuiz && !showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 text-black flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full p-6"
            >
              <div className="mb-6">
                <progress
                  value={(currentQuestion + 1) / questions.length * 100} 
                  className="h-2"
                />
                <p className="text-sm text-gray-600 mt-2">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">
                  {questions[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <motion.button
                      key={index}
                      className={`w-full p-4 rounded-lg border-2 transition-all flex items-center space-x-3
                        ${selectedAnswers[currentQuestion] === index 
                          ? 'border-purple-500 bg-purple-50' 
                          : 'border-gray-200 hover:border-purple-200'}`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center
                        ${selectedAnswers[currentQuestion] === index 
                          ? 'bg-purple-500' 
                          : 'bg-gray-100'}`}
                      >
                        {selectedAnswers[currentQuestion] === index && (
                          <Check className="w-4 h-4 text-black" />
                        )}
                      </div>
                      <span>{option}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  className={`px-6 py-2 rounded-lg text-black
                    ${selectedAnswers[currentQuestion] === null 
                      ? 'bg-gray-400' 
                      : 'bg-purple-600 hover:bg-purple-700'}`}
                  whileHover={selectedAnswers[currentQuestion] !== null ? { scale: 1.05 } : {}}
                  whileTap={selectedAnswers[currentQuestion] !== null ? { scale: 0.95 } : {}}
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === null}
                >
                  {currentQuestion < questions.length - 1 ? 'Next' : 'Show Results'}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowResults(false);
              setShowQuiz(false);
              setCurrentQuestion(0);
              setSelectedAnswers([]);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-8 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Quiz Complete!</h3>
                <p className="text-gray-600">
                  You scored {calculateScore()} out of {questions.length}
                </p>
              </div>

              <div className="space-y-4">
                <motion.button
                  className="w-full px-6 py-3 bg-purple-600 text-black rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowResults(false);
                    setShowQuiz(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                  }}
                >
                  Try Another Topic
                </motion.button>
                <p className="text-sm text-gray-500">Click anywhere to close</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {error && renderRateLimitError()}
      </AnimatePresence>
    </>
  );
};

export default QuizDialog;