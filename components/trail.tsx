import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Lock } from "lucide-react";
import { Card, CardContent } from "@mui/material";

const LoadingAnimation = () => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl p-8 flex flex-col items-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <svg width="120" height="120" viewBox="0 0 120 120">
          {/* Face circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="black"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              rotate: 360,
            }}
            transition={{
              pathLength: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            }}
          />

          {/* Eyes */}
          <motion.circle
            cx="40"
            cy="50"
            r="5"
            fill="black"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 1, 0] }}
            transition={{
              duration: 2,
              times: [0, 0.2, 0.8, 1],
              repeat: Infinity,
            }}
          />
          <motion.circle
            cx="80"
            cy="50"
            r="5"
            fill="black"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 1, 0] }}
            transition={{
              duration: 2,
              times: [0, 0.2, 0.8, 1],
              repeat: Infinity,
            }}
          />

          {/* Smile */}
          <motion.path
            d="M40 70 Q60 90 80 70"
            fill="none"
            stroke="black"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 1,
              delay: 0.5,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        </svg>
        <motion.p
          className="mt-4 text-lg font-semibold text-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2,
            times: [0, 0.2, 0.8, 1],
            repeat: Infinity,
          }}
        >
          Generating your quiz...
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

const QuizDialog = () => {
  const [demoText, setDemoText] = useState("");
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
      if (demoText.trim() === "") {
        setError({ error: "Please enter some text to generate questions." });
        return;
      }
      const response = await fetch(
        `/api/trail?context=${encodeURIComponent(demoText)}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data);
        setIsGenerating(false);
        return;
      }

      // Add artificial delay for smoother animation
      await new Promise((resolve) => setTimeout(resolve, 2000));

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

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
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
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-2 box-border bg-red-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Rate Limit Exceeded</h3>
            <p className="text-gray-600 mb-6 text-center font-normal">
              Upgrade your plan to generate unlimited questions and access
              premium features.
            </p>
            <div className="space-x-4">
              <motion.button
                className="px-6 py-2 duration-150 border-black border rounded-lg"
                whileTap={{ scale: 0.5 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add your upgrade navigation logic here
                }}
              >
                Upgrade plan
              </motion.button>
              <motion.button
                className="px-6 py-2 duration-150 bg-black border-black border text-white rounded-lg"
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  // Add your register navigation logic here
                }}
              >
                Register now
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
            className="w-full h-32 bg-gray-800 rounded-lg p-4 mb-4 text-white"
            placeholder="Paste your content or enter a topic..."
          />
          <motion.button
            className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Questions"}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isGenerating && <LoadingAnimation />}
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
                      className={`w-full p-4 text-left h-fit rounded-lg border-2 transition-all flex items-center space-x-3
    ${
      selectedAnswers[currentQuestion] === index
        ? "border-black bg-slate-50"
        : "border-gray-200 hover:border-purple-200"
    }`}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        {/* Check icon container */}
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
        ${
          selectedAnswers[currentQuestion] === index
            ? "bg-black text-white"
            : "bg-gray-100"
        }`}
                        >
                          {selectedAnswers[currentQuestion] === index && (
                            <Check className="w-4 h-4 text-white" />
                          )}
                        </div>

                        {/* Option text */}
                        <span className="flex-1">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                {/* want for previous button also */}
                <motion.button
                  className={`px-6 py-2 rounded-lg text-black
                    ${
                      currentQuestion === 0 ? "bg-gray-400" : "bg-black"
                    } text-white`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </motion.button>
                <motion.button
                  className={`px-6 py-2 rounded-lg text-black
                    ${
                      selectedAnswers[currentQuestion] === null
                        ? "bg-gray-400"
                        : "bg-black"
                    } text-white`}
                  whileTap={
                    selectedAnswers[currentQuestion] !== null
                      ? { scale: 0.95 }
                      : {}
                  }
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestion] === null}
                >
                  {currentQuestion < questions.length - 1
                    ? "Next"
                    : "Show Results"}
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
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">
                  Quiz Complete!
                </h3>
                <p className="text-gray-600 text-lg font-semibold text-center">
                  You scored {calculateScore()} out of {questions.length}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">Click anywhere to close</p>
              </div>
            </motion.div>
          </motion.div>
        )}
        {error?.error === "Rate limit exceeded. Please register to continue." &&
          renderRateLimitError()}{" "}
        {error?.error === "Please enter some text to generate questions." && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-gradient-to-b from-black/60 to-black/30 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
  >
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className="bg-gradient-to-b from-white to-gray-100 shadow-xl rounded-3xl max-w-lg w-full p-8"
    >
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">
          Missing Input
        </h2>
        <p className="text-sm text-gray-600">
          Please enter some text to generate your questions.
        </p>
        <div className="pt-4">
          <button
            onClick={() => {
              // Add your close logic here
              setError(null);
            }}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)}

      </AnimatePresence>
    </>
  );
};

export default QuizDialog;
