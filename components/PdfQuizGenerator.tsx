// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FilePond } from "react-filepond";
// import { Loader2, Send } from "lucide-react";
// import CustomizationPanelPdfBased from "./CustomisationPanelTopic";
// import { Dialog } from "@mui/material";
// import EnhancedQuiz from "./EnhancedQuiz";
// import QuizReview from "./QuizReview";
// // import QuizPDFButton from "./QuizPDFButton";

// type Settings = {
//   difficulty: string;
//   numQuestions: number;
//   questionType: string;
// };

// const PDFQuizGenerator = () => {
//   const [serverResponse, setServerResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openPromptModal, setOpenPromptModal] = useState(false);
//   const [prompt, setPrompt] = useState("");
//   const [loadingText, setLoadingText] = useState("");
//   const [Questions, setQuestions] = useState({
//     is_loaded: false,
//     questions: [],
//     title: "",
//   });

//   const handleGenerateQuiz = async () => {
//     setLoading(true);
//     try {
//       console.log(settings.questionType);
//       const response = await fetch("/api/pdf-based-generation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           command: `Generate ${
//             settings?.numQuestions
//           } mcq questions with a difficulty level of ${
//             settings?.difficulty === "mixed"
//               ? "mix of hard, medium and easy"
//               : settings?.difficulty
//           } from the following text & the questions types can be ${
//             settings?.questionType === "mcq"
//               ? "mcq"
//               : "mcqs should be 55-65% of the total questions and others should be random. order should be random also options also should be random and tough to guess"
//           }. additional instructions: ${prompt || "none"}`,
//           description: serverResponse?.replace(/\n/g, " "),
//         }),
//       });
//       const data = await response.json();
//       setQuestions({
//         is_loaded: true,
//         questions: data?.data?.questions,
//         title: data?.data?.title,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (loading) {
//       const texts = [
//         "Analyzing topics...",
//         "Generating questions...",
//         "Applying AI magic...",
//       ];
//       let i = 0;
//       const interval = setInterval(() => {
//         setLoadingText(texts[i % texts.length]);
//         i++;
//       }, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [loading]);

//   const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
//   const [settings, setSettings] = useState<Settings>({
//     difficulty: "medium",
//     numQuestions: 10,
//     questionType: "mcq",
//   });

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="w-full space-y-6 text-black"
//     >
//       <CustomizationPanelPdfBased
//         settings={settings}
//         setSettings={setSettings}
//         isOpen={isCustomizationOpen}
//         setIsOpen={setIsCustomizationOpen}
//       />

//       <FilePond
//         server={{
//           process: "/api/upload-pdf",
//           fetch: null,
//           revert: null,
//         }}
//         onprocessfile={(error, file) => {
//           if (!error) {
//             setServerResponse(JSON.parse(file.serverId).textChunk);
//           }
//         }}
//       />

//       {serverResponse && (
//         <div className="p-2 space-y-4">
//           <textarea
//             className="w-full p-4 border border-gray-300 rounded-xl"
//             value={prompt}
//             placeholder="Want to add any additional prompts"
//             onChange={(e) => setPrompt(e.target.value)}
//           />
//         </div>
//       )}

//       {serverResponse &&
//         (Questions.is_loaded ? (
//           <QuizReview
//             title={Questions?.title !== "" ? Questions.title : "Generated Quiz"}
//             questions={Questions.questions}
//           />
//         ) : (
//           <motion.button
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             onClick={() => {
//               handleGenerateQuiz();
//             }}
//             className="w-full py-4 flex items-center justify-center space-x-2 rounded-xl bg-black text-white"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 <span>{loadingText}</span>
//               </>
//             ) : (
//               <>
//                 <Send className="w-5 h-5" />
//                 <span>Generate Quiz</span>
//               </>
//             )}
//           </motion.button>
//         ))}
//     </motion.div>
//   );
// };

// export default PDFQuizGenerator;

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FilePond } from "react-filepond";
// import { Loader2, Send, Layers } from "lucide-react";
// import CustomizationPanelPdfBased from "./CustomisationPanelTopic";
// import { Dialog } from "@mui/material";
// import EnhancedQuiz from "./EnhancedQuiz";
// import QuizReview from "./QuizReview";
// // import QuizPDFButton from "./QuizPDFButton";

// type Settings = {
//   difficulty: string;
//   numQuestions: number;
//   questionType: string;
// };

// const PDFQuizGenerator = () => {
//   const [serverResponse, setServerResponse] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [openPromptModal, setOpenPromptModal] = useState(false);
//   const [prompt, setPrompt] = useState("");
//   const [loadingText, setLoadingText] = useState("");
//   const [generateMultipleSets, setGenerateMultipleSets] = useState(false);
//   const [Questions, setQuestions] = useState({
//     is_loaded: false,
//     questions: [],
//     title: "",
//   });

//   const handleGenerateQuiz = async () => {
//     setLoading(true);
//     try {
//       console.log(settings.questionType);
//       const response = await fetch("/api/pdf-based-generation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           command: `Generate ${
//             generateMultipleSets
//               ? 2 * settings?.numQuestions
//               : settings?.numQuestions
//           } mcq questions with a difficulty level of ${
//             settings?.difficulty === "mixed"
//               ? "mix of hard, medium and easy"
//               : settings?.difficulty
//           } from the following text & the questions types can be ${
//             settings?.questionType === "mcq"
//               ? "mcq"
//               : "mcqs should be 55-65% of the total questions and others should be random. order should be random also options also should be random and tough to guess"
//           }. ${
//             generateMultipleSets
//               ? `Out of those ${
//                   settings?.numQuestions * 2
//                 } questions in total, all within a single array, The first ${
//                   settings?.numQuestions
//                 } questions should form one set, and the last ${
//                   settings?.numQuestions
//                 } questions should form another set, but they should all be part of the same array. Ensure both sets feel distinct yet derived from the same data, allowing the user to pick either the first ${
//                   settings?.numQuestions
//                 } or the last ${settings?.numQuestions}.`
//               : ""
//           } additional instructions: ${prompt || "none"}.`,
//           description: serverResponse?.replace(/\n/g, " "),
//         }),
//       });
//       const data = await response.json();
//       setQuestions({
//         is_loaded: true,
//         questions: data?.data?.questions,
//         title: data?.data?.title,
//       });
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (loading) {
//       const texts = [
//         "Analyzing topics...",
//         "Generating questions...",
//         "Applying AI magic...",
//       ];
//       let i = 0;
//       const interval = setInterval(() => {
//         setLoadingText(texts[i % texts.length]);
//         i++;
//       }, 2000);
//       return () => clearInterval(interval);
//     }
//   }, [loading]);

//   const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
//   const [settings, setSettings] = useState<Settings>({
//     difficulty: "medium",
//     numQuestions: 10,
//     questionType: "mcq",
//   });

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -20 }}
//       className="w-full space-y-6 text-black"
//     >
//       <CustomizationPanelPdfBased
//         settings={settings}
//         setSettings={setSettings}
//         isOpen={isCustomizationOpen}
//         setIsOpen={setIsCustomizationOpen}
//       />

//       <FilePond
//         server={{
//           process: "/api/upload-pdf",
//           fetch: null,
//           revert: null,
//         }}
//         onprocessfile={(error, file) => {
//           if (!error) {
//             setServerResponse(JSON.parse(file.serverId).textChunk);
//           }
//         }}
//       />

//       {serverResponse && (
//         <div className="p-2 space-y-4">
//           <div className="flex flex-col space-y-3">
//             <div className="flex items-center justify-between">
//               <label className="font-medium text-gray-700">
//                 Additional Instructions
//               </label>
//               <div
//                 className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${
//                   generateMultipleSets
//                     ? "bg-black text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//                 onClick={() => setGenerateMultipleSets(!generateMultipleSets)}
//               >
//                 <Layers className="w-4 h-4" />
//                 <span className="text-sm font-medium">
//                   Generate Multiple Sets
//                 </span>
//               </div>
//             </div>

//             <textarea
//               className="w-full p-4 border border-gray-300 rounded-xl"
//               value={prompt}
//               placeholder={
//                 generateMultipleSets
//                   ? "Add any additional instructions (will generate 2 sets of questions)"
//                   : "Want to add any additional prompts?"
//               }
//               onChange={(e) => setPrompt(e.target.value)}
//             />

//             {generateMultipleSets && (
//               <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
//                 <p>
//                   System will generate 2 different sets of questions based on
//                   the same content.
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {serverResponse &&
//         (Questions.is_loaded ? (
//           <QuizReview
//             title={Questions?.title !== "" ? Questions.title : "Generated Quiz"}
//             questions={Questions.questions.slice(0, settings.numQuestions)}
//           />
//         ) : (
//           <motion.button
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             onClick={() => {
//               handleGenerateQuiz();
//             }}
//             className="w-full py-4 flex items-center justify-center space-x-2 rounded-xl bg-black text-white"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             {loading ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" />
//                 <span>{loadingText}</span>
//               </>
//             ) : (
//               <>
//                 <Send className="w-5 h-5" />
//                 <span>
//                   Generate Quiz{generateMultipleSets ? " (Multiple Sets)" : ""}
//                 </span>
//               </>
//             )}
//           </motion.button>
//         ))}
//     </motion.div>
//   );
// };

// export default PDFQuizGenerator;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilePond } from "react-filepond";
import { Loader2, Send, Layers, CheckCircle } from "lucide-react";
import CustomizationPanelPdfBased from "./CustomisationPanelTopic";
import { Dialog } from "@mui/material";
import EnhancedQuiz from "./EnhancedQuiz";
import QuizReview from "./QuizReview";
// import QuizPDFButton from "./QuizPDFButton";

type Settings = {
  difficulty: string;
  numQuestions: number;
  questionType: string;
};

const PDFQuizGenerator = () => {
  const [serverResponse, setServerResponse] = useState("");
  const [loading, setLoading] = useState(false);
  // const [openPromptModal, setOpenPromptModal] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [generateMultipleSets, setGenerateMultipleSets] = useState(false);
  const [Questions, setQuestions] = useState({
    is_loaded: false,
    questions: [],
    title: "",
  });
  const [selectedSetIndex, setSelectedSetIndex] = useState(0); // 0 for first set, 1 for second set

  const handleGenerateQuiz = async () => {
    setLoading(true);
    try {
      console.log(settings.questionType);
      const response = await fetch("/api/pdf-based-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          command: `Generate ${
            generateMultipleSets
              ? 2 * settings?.numQuestions
              : settings?.numQuestions
          } mcq questions with a difficulty level of ${
            settings?.difficulty === "mixed"
              ? "mix of hard, medium and easy"
              : settings?.difficulty
          } from the following text & the questions types can be ${
            settings?.questionType === "mcq"
              ? "mcq"
              : "mcqs should be 55-65% of the total questions and others should be random. order should be random also options also should be random and tough to guess"
          }. ${
            generateMultipleSets
              ? `Out of those ${
                  settings?.numQuestions * 2
                } questions in total, all within a single array, The first ${
                  settings?.numQuestions
                } questions should form one set, and the last ${
                  settings?.numQuestions
                } questions should form another set, but they should all be part of the same array. Ensure both sets feel distinct yet derived from the same data, allowing the user to pick either the first ${
                  settings?.numQuestions
                } or the last ${settings?.numQuestions}.`
              : ""
          } additional instructions: ${prompt || "none"}.`,
          description: serverResponse?.replace(/\n/g, " "),
        }),
      });
      const data = await response.json();
      setQuestions({
        is_loaded: true,
        questions: data?.data?.questions,
        title: data?.data?.title,
      });
      setSelectedSetIndex(0); // Reset to first set when new questions are generated
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

  // Function to handle final submission of the selected question set
  const handleSubmitSelectedSet = async () => {
    const selectedQuestions = generateMultipleSets
      ? selectedSetIndex === 1
        ? Questions.questions.slice(0, settings.numQuestions)
        : Questions.questions.slice(
            settings.numQuestions,
            settings.numQuestions * 2
          )
      : Questions.questions.slice(0, settings.numQuestions);
  };

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
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">
                Additional Instructions
              </label>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer transition-all duration-200 ${
                  generateMultipleSets
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setGenerateMultipleSets(!generateMultipleSets)}
              >
                <Layers className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Generate Multiple Sets
                </span>
              </div>
            </div>

            <textarea
              className="w-full p-4 border border-gray-300 rounded-xl"
              value={prompt}
              placeholder={
                generateMultipleSets
                  ? "Add any additional instructions (will generate 2 sets of questions)"
                  : "Want to add any additional prompts?"
              }
              onChange={(e) => setPrompt(e.target.value)}
            />

            {generateMultipleSets && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                <p>
                  System will generate 2 different sets of questions based on
                  the same content.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {serverResponse &&
        (Questions.is_loaded ? (
          <div className="space-y-6">
            {generateMultipleSets && (
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedSetIndex(0)}
                  className={`flex-1 py-3 px-4 text-center font-medium transition ${
                    selectedSetIndex === 0
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Both sets
                </button>
                <button
                  onClick={() => setSelectedSetIndex(1)}
                  className={`flex-1 py-3 px-4 text-center font-medium transition ${
                    selectedSetIndex === 1
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Question Set 1
                </button>
                <button
                  onClick={() => setSelectedSetIndex(2)}
                  className={`flex-1 py-3 px-4 text-center font-medium transition ${
                    selectedSetIndex === 2
                      ? "bg-black text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  Question Set 2
                </button>
              </div>
            )}
            <QuizReview
              title={
                Questions?.title !== ""
                  ? Questions.title
                  : `Generated Quiz - Set ${selectedSetIndex + 1}`
              }
              questions={
                generateMultipleSets
                  ? selectedSetIndex === 0
                    ? Questions.questions
                    : selectedSetIndex === 1
                    ? Questions.questions.slice(0, settings.numQuestions)
                    : Questions.questions.slice(
                        settings.numQuestions,
                        settings.numQuestions * 2
                      )
                  : Questions.questions
              }
            />
          </div>
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
                <span>
                  Generate Quiz{generateMultipleSets ? " (Multiple Sets)" : ""}
                </span>
              </>
            )}
          </motion.button>
        ))}
    </motion.div>
  );
};

export default PDFQuizGenerator;
