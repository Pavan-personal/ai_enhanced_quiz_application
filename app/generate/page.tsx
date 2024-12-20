"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TextField,
  Slider,
  Switch,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
} from "@mui/material";

import {
  Bot,
  FileText,
  Book,
  Search,
  Settings,
  X,
  Loader2,
  Send,
  Sparkles,
  ChevronDown,
  Clock,
  Brain,
  Target,
  Layout,
  NotebookPen,
} from "lucide-react";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";

const QUESTION_TYPE_OPTIONS = [
  { id: "mcq", label: "Multiple Choice", color: "#2196f3" },
  { id: "fill-in-the-blanks", label: "Fill in the Blanks", color: "#4caf50" },
  { id: "assertion-reason", label: "Assertion Reason", color: "#ff9800" },
  { id: "true-false", label: "True/False", color: "#9c27b0" },
];

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  FormControl,
  FormControlLabel,
  Chip,
} from "@mui/material";

const CustomizationPanel = ({
  settings,
  setSettings,
  isOpen,
  setIsOpen,
}: {
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (selectedTypes.length > 0) {
      setSettings((prev) => ({
        ...prev,
        questionTypes: selectedTypes.join(","),
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        questionTypes: "mcq",
      }));
    }
  }, [selectedTypes, setSettings]);

  useEffect(() => {
    if (settings.questionType) {
      setSelectedTypes(settings.questionType.split(","));
    }
  }, [settings.questionType]);

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((t) => t !== typeId);
      }
      return [...prev, typeId];
    });
  };

  const handleAccordionChange = (
    event: React.SyntheticEvent,
    newExpanded: boolean
  ) => {
    setIsOpen(newExpanded);
  };

  return (
    <div className="w-full space-y-6">
      <Accordion
        expanded={isOpen}
        onChange={handleAccordionChange}
        sx={{
          backgroundColor: "#f8fafc",
          borderRadius: "0.75rem",
          "&:before": {
            display: "none",
          },
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ChevronDown className="w-5 h-5" />}
          sx={{
            padding: "1rem",
            "& .MuiAccordionSummary-content": {
              margin: 0,
            },
          }}
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <Typography>Customizations</Typography>
          </div>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: "1.5rem", paddingTop: 0 }}>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <FormControl fullWidth>
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-4 h-4" style={{ color: "#3b82f6" }} />
                  <Typography>Difficulty Level</Typography>
                </div>
                <Select
                  value={settings.difficulty}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      difficulty: e.target.value as string,
                    })
                  }
                  variant="outlined"
                >
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <div className="flex items-center space-x-2 mb-3">
                  <Target className="w-4 h-4" style={{ color: "#10b981" }} />
                  <Typography>Number of Questions</Typography>
                </div>
                <Select
                  value={settings.numQuestions}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      numQuestions: parseInt(e.target.value as string),
                    })
                  }
                  variant="outlined"
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                </Select>
              </FormControl>
            </div>

            <FormControl component="fieldset" className="w-full">
              <div className="flex items-center space-x-2 mb-3">
                <NotebookPen className="w-4 h-4" style={{ color: "#" }} />
                <Typography>Question Types</Typography>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {QUESTION_TYPE_OPTIONS.map((type) => (
                  <FormControlLabel
                    key={type.id}
                    control={
                      <Checkbox
                        checked={selectedTypes.includes(type.id)}
                        onChange={() => handleTypeToggle(type.id)}
                        sx={{
                          "&.Mui-checked": {
                            color: "black",
                          },
                        }}
                      />
                    }
                    label={
                      <div className="flex items-center space-x-2">
                        <Typography>{type.label}</Typography>
                        {selectedTypes.includes(type.id) && (
                          <Chip
                            size="small"
                            label="Selected"
                            sx={{
                              backgroundColor: "black",
                              color: "white",
                              fontSize: "0.7rem",
                            }}
                          />
                        )}
                      </div>
                    }
                  />
                ))}
              </div>
            </FormControl>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

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
          command:
            "generate 10 mcq questions from the following text in format of {question: 'string', answer: 'string', options: ['string', 'string', 'string', 'string']}",
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
      className="w-full space-y-6 text-black"
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
          className="w-full py-4 rounded-xl flex items-center justify-center space-x-2"
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

const TopicQuizGenerator = () => {
  const [keyword, setKeyword] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [settingS, setSettingS] = useState({
    difficulty: "medium",
    numberOfQuestions: 10,
    style: "classic",
  });

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/generate-topics?keyword=${encodeURIComponent(keyword)}`
      );
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
      const response = await fetch("/api/topic-based-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: "generate mcq questions",
          topics: selectedTopics,
          ...settings,
          questionType: settings.questionType,
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
      const texts = [
        "Analyzing topics...",
        "Generating questions...",
        "Applying AI magic...",
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    difficulty: "medium",
    numQuestions: 10,
    questionType: "mcq",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full space-y-6"
    >
      <CustomizationPanel
        settings={settings}
        setSettings={setSettings}
        isOpen={isCustomizationOpen}
        setIsOpen={setIsCustomizationOpen}
      />
      <div className="space-y-4">
        <TextField
          fullWidth
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter a topic..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "white",
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
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
                onClick={() =>
                  setSelectedTopics((prev) =>
                    prev.includes(topic)
                      ? prev.filter((t) => t !== topic)
                      : [...prev, topic]
                  )
                }
                className={`px-4 py-2 rounded-full border ${
                  selectedTopics.includes(topic)
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200 hover:border-black"
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
