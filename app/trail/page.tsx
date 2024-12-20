"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import { Progress } from "@/components/ui/progress";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Check, ChevronRight, Loader2, Star } from "lucide-react";
import { Button, Card, CardContent } from "@mui/material";

const QuizInterface = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const fetchQuestions = async ({ context }: { context: String }) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/trail?context=${context || "dbms"}'`
      );
      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
        setShowQuiz(true);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    }
  };

  const renderQuestion = (question: { type: string; question: string; options: string[]; statment?: string; reason?: string }) => {
    const variants = {
      enter: { x: 1000, opacity: 0 },
      center: { x: 0, opacity: 1 },
      exit: { x: -1000, opacity: 0 },
    };

    return (
      <motion.div
        key={currentQuestion}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full"
      >
        <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 shadow-xl">
          <CardContent className="p-6">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {question.type === "mcq"
                  ? "Multiple Choice"
                  : question.type === "fill-in-blank"
                  ? "Fill in the Blank"
                  : "Assertion Reasoning"}
              </span>
            </div>

            <h3 className="text-lg font-semibold mb-4">{question.question}</h3>

            {question.type === "assertion-reason" && (
              <div className="mb-4 p-4 bg-purple-50 rounded-lg">
                <p className="font-medium mb-2">
                  Statement: {question.statment}
                </p>
                <p className="font-medium">Reason: {question.reason}</p>
              </div>
            )}

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedAnswer(index)}
                  className={`w-full p-4 rounded-lg border-2 transition-colors ${
                    selectedAnswer === index
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        selectedAnswer === index
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {selectedAnswer === index ? <Check size={14} /> : null}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {!showQuiz ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <CardContent className="p-8 text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="mb-6"
              >
                <Star className="w-16 h-16 mx-auto" />
              </motion.div>
              <h2 className="text-2xl font-bold mb-4">
                Experience Premium Features
              </h2>
              <p className="mb-6 opacity-90">
                Get a sneak peek of our advanced question generation system
              </p>
              <Button
                onClick={() => fetchQuestions({ context: "dbms" })}
                disabled={isLoading}
                className="bg-white text-purple-600 hover:bg-gray-100"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Generating...
                  </>
                ) : (

                  "Generate Questions"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <progress
              value={((currentQuestion + 1) / questions.length) * 100}
              className="w-2/3"
            />
            <span className="text-sm font-medium">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {renderQuestion(questions[currentQuestion])}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            {currentQuestion < questions.length - 1 ? (
              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={() => alert("Quiz completed!")}
                disabled={selectedAnswer === null}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit
              </Button>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
