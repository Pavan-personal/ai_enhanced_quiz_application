import { useEffect, useState } from "react";
import CustomizationPanelTopicBased from "./CustomisationPanelTopic";
import { TextField } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Search, Send, X } from "lucide-react";
import EnhancedQuiz from "./EnhancedQuiz";
// import QuizPDFButton from "./QuizPDFButton";

const TopicQuizGenerator = () => {
  const [keyword, setKeyword] = useState("");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [Questions, setQuestions] = useState({
    is_loaded: false,
    questions: [],
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
          prompt,
        }),
      });
      const data = await response.json();
      console.log(data);
      setQuestions({
        is_loaded: true,
        questions: data.questions,
      });
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
      <CustomizationPanelTopicBased
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
        <div className="p-2 space-y-4">
          <textarea
            className="w-full p-4 border border-gray-300 text-black rounded-xl"
            value={prompt}
            placeholder="Want to add any additional prompts"
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      )}

      {selectedTopics.length > 0 &&
        (Questions.is_loaded ? (
          <EnhancedQuiz questions={Questions.questions} />
        ) : (
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
        ))}

      {}
    </motion.div>
  );
};

export default TopicQuizGenerator;
