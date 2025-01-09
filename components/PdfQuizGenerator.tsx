import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilePond } from "react-filepond";
import { Loader2, Send } from "lucide-react";
import CustomizationPanelPdfBased from "./CustomisationPanelTopic";
import { Dialog } from "@mui/material";
import EnhancedQuiz from "./EnhancedQuiz";
import QuizReview from "./QuizReview";
// import QuizPDFButton from "./QuizPDFButton";

const PDFQuizGenerator = () => {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [openPromptModal, setOpenPromptModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [Questions, setQuestions] = useState({
    is_loaded: false,
    questions: [],
    title: "",
  });

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      console.log(settings.questionType);
      const response = await fetch("/api/pdf-based-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `Generate ${
            settings?.numQuestions
          } mcq questions with a difficulty level of ${
            settings?.difficulty === "mixed"
              ? "mix of hard, medium and easy"
              : settings?.difficulty
          } from the following text & the questions types can be ${
            settings?.questionType === "mcq"
              ? "mcq"
              : "mcqs should be 55-65% of the total questions and others should be random. order should be random also options also should be random and tough to guess"
          }. additional instructions: ${prompt || "none"}`,
          description: serverResponse?.replace(/\n/g, " "),
        }),
      });
      const data = await response.json();
      setQuestions({
        is_loaded: true,
        questions: data?.data?.questions,
        title: data?.data?.title,
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
      className="w-full space-y-6 text-black"
    >
      <CustomizationPanelPdfBased
        settings={settings}
        setSettings={setSettings}
        isOpen={isCustomizationOpen}
        setIsOpen={setIsCustomizationOpen}
      />

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
        <div className="p-2 space-y-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-xl"
            value={prompt}
            placeholder="Want to add any additional prompts"
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      )}

      {serverResponse &&
        (Questions.is_loaded ? (
          <QuizReview
            title={Questions?.title !== "" ? Questions.title : "Generated Quiz"}
            questions={Questions.questions}
          />
        ) : (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              handleGenerateQuiz();
            }}
            className="w-full py-4 flex items-center justify-center space-x-2 rounded-xl bg-black text-white"
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
        ))}
    </motion.div>
  );
};

export default PDFQuizGenerator;
