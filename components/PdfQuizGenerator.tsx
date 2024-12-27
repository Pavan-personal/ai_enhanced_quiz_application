import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilePond } from "react-filepond";
import { Loader2, Send } from "lucide-react";
import CustomizationPanelPdfBased from "./CustomisationPanelTopic";
import { Dialog } from "@mui/material";

const PDFQuizGenerator = () => {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [openPromptModal, setOpenPromptModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loadingText, setLoadingText] = useState("");

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      console.log(settings.questionType);
      const response = await fetch("/api/pdf-based-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `generate ${
            settings?.numQuestions
          } mcq questions with a difficulty level of ${
            settings?.difficulty === "mixed"
              ? "mix of hard, medium and easy"
              : settings?.difficulty
          } from the following text in format of {type: 'mcq or t/f or assertion or fill-in-blank',question: 'string', answer: 'string', options: ['string', 'string', 'string', 'string']}. the questions types can be ${
            settings?.questionType === "mcq"
              ? "mcq"
              : "mcqs should be 55-65% of the total questions and others should be random. order should be random also options also should be random and tough to guess"
          }. additional instructions: ${prompt || "none"}`,
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

      {serverResponse && (
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
      )}
      {/* {serverResponse ? (
        loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>Generate Quiz</span>
          </>
        )
      ) : null} */}

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

export default PDFQuizGenerator;
