// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Typography,
//   Radio,
//   RadioGroup,
//   FormControlLabel,
//   Paper,
//   LinearProgress,
//   useTheme,
//   useMediaQuery,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {
//   Close,
//   NavigateNext,
//   NavigateBefore,
//   Download,
//   Check,
//   Clear,
// } from "@mui/icons-material";
// import "katex/dist/katex.min.css";
// import { InlineMath, BlockMath } from "react-katex";

// // Styled components
// const StyledDialog = styled(Dialog)(({ theme }) => ({
//   "& .MuiDialog-paper": {
//     maxWidth: "900px",
//     width: "95vw",
//     minHeight: "80vh",
//     borderRadius: "16px",
//     backgroundColor: theme.palette.background.default,
//   },
// }));

// const QuestionCard = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   margin: theme.spacing(2, 0),
//   borderRadius: "12px",
//   background: "#fff",
//   boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//   transition: "transform 0.2s ease-in-out",
//   "&:hover": {
//     transform: "translateY(-2px)",
//   },
// }));

// const OptionButton = styled(FormControlLabel)(({ theme }) => ({
//   width: "100%",
//   margin: theme.spacing(1, 0),
//   "& .MuiRadio-root": {
//     padding: theme.spacing(1),
//   },
//   "& .MuiTypography-root": {
//     width: "100%",
//     padding: theme.spacing(1.5),
//     borderRadius: "8px",
//     border: `1px solid ${theme.palette.divider}`,
//     transition: "all 0.2s ease",
//     "&:hover": {
//       backgroundColor: theme.palette.action.hover,
//     },
//   },
// }));

// interface QuizQuestion {
//   type: string;
//   question: string;
//   answer: number;
//   options: string[];
// }

// interface EnhancedQuizProps {
//   questions: QuizQuestion[];
// }

// // Helper function to identify and parse different content types
// const parseContent = (text: string) => {
//   const segments = [];
//   let currentIndex = 0;
//   const patterns = {
//     math: /\$\$(.*?)\$\$|\$(.*?)\$/g,
//     chemical: /\{([^}]+)\}/g,
//     code: /```(\w*)\n([\s\S]*?)```/g,
//   };

//   const mathMatches = [...text.matchAll(patterns.math)];
//   const chemMatches = [...text.matchAll(patterns.chemical)];
//   const codeMatches = [...text.matchAll(patterns.code)];

//   const allMatches = [
//     ...mathMatches.map((m) => ({ type: "math", match: m })),
//     ...chemMatches.map((m) => ({ type: "chemical", match: m })),
//     ...codeMatches.map((m) => ({ type: "code", match: m })),
//   ].sort((a, b) => (a.match.index || 0) - (b.match.index || 0));

//   allMatches.forEach(({ type, match }) => {
//     const matchStart = match.index || 0;
//     if (matchStart > currentIndex) {
//       segments.push({
//         type: "text",
//         content: text.slice(currentIndex, matchStart),
//       });
//     }

//     if (type === "math") {
//       const isBlock = match[0].startsWith("$$");
//       const content = match[1] || match[2];
//       segments.push({
//         type: "math",
//         content,
//         isBlock,
//       });
//     } else if (type === "chemical") {
//       const formula = match[1]
//         .replace(/(\d+)/g, "_{$1}")
//         .replace(/(\d*[\+\-])/g, "^{$1}");
//       segments.push({
//         type: "math",
//         content: `\\ce{${formula}}`,
//         isBlock: false,
//       });
//     } else if (type === "code") {
//       segments.push({
//         type: "code",
//         language: match[1],
//         content: match[2].trim(),
//       });
//     }

//     currentIndex = matchStart + match[0].length;
//   });

//   if (currentIndex < text.length) {
//     segments.push({
//       type: "text",
//       content: text.slice(currentIndex),
//     });
//   }

//   return segments;
// };

// const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
//   const segments = parseContent(content);

//   return (
//     <Box sx={{ fontSize: "1rem", lineHeight: 1.6 }}>
//       {segments.map((segment: 
//         {
//           type: string;
//           content: string;
//           isBlock?: boolean;
//           language?: string;
//         }
//       , index) => {
//         switch (segment.type) {
//           case "math":
//             return segment.isBlock ? (
//               <BlockMath key={index}>{segment.content}</BlockMath>
//             ) : (
//               <InlineMath key={index}>{segment.content}</InlineMath>
//             );
//           case "code":
//             return (
//               <Box
//                 key={index}
//                 sx={{
//                   backgroundColor: "#f5f5f5",
//                   padding: 2,
//                   borderRadius: 1,
//                   fontFamily: "monospace",
//                   overflow: "auto",
//                   my: 2,
//                 }}
//               >
//                 <pre style={{ margin: 0 }}>{segment.content}</pre>
//               </Box>
//             );
//           default:
//             return <span key={index}>{segment.content}</span>;
//         }
//       })}
//     </Box>
//   );
// };

// export const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ questions }) => {
//   const [open, setOpen] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
//     new Array(questions.length).fill(-1)
//   );
//   const [showResults, setShowResults] = useState(false);

//   const theme = useTheme();
//   const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

//   const handleAnswer = (value: number) => {
//     const newAnswers = [...selectedAnswers];
//     newAnswers[currentQuestion] = value;
//     setSelectedAnswers(newAnswers);
//   };

//   const calculateScore = () => {
//     return selectedAnswers.reduce(
//       (score, answer, index) =>
//         score + (answer === questions[index].answer ? 1 : 0),
//       0
//     );
//   };

//   const progress =
//     (selectedAnswers.filter((a) => a !== -1).length / questions.length) * 100;

//   const handleDownloadPDF = () => {
//     // Implementation for PDF download using existing QuizPDFButton logic
//     window.print(); // Placeholder - replace with actual PDF generation
//   };

//   return (
//     <>
//       <Button
//         variant="contained"
//         onClick={() => setOpen(true)}
//         fullWidth
//         sx={{
//           py: 2,
//           borderRadius: 2,
//           bgcolor: theme.palette.primary.main,
//           "&:hover": {
//             bgcolor: theme.palette.primary.dark,
//           },
//         }}
//       >
//         Start Quiz
//       </Button>

//       <StyledDialog
//         fullScreen={fullScreen}
//         open={open}
//         onClose={() => setOpen(false)}
//       >
//         <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
//           <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//           >
//             <Typography variant="h6">
//               {showResults
//                 ? "Quiz Results"
//                 : `Question ${currentQuestion + 1} of ${questions.length}`}
//             </Typography>
//             <IconButton onClick={() => setOpen(false)}>
//               <Close />
//             </IconButton>
//           </Box>
//           <LinearProgress
//             variant="determinate"
//             value={progress}
//             sx={{ mt: 2 }}
//           />
//         </DialogTitle>

//         <DialogContent>
//           {!showResults ? (
//             <Box>
//               <QuestionCard elevation={2}>
//                 <Typography variant="h6" gutterBottom>
//                   <ContentRenderer
//                     content={questions[currentQuestion].question}
//                   />
//                 </Typography>
//                 <RadioGroup
//                   value={selectedAnswers[currentQuestion]}
//                   onChange={(e) => handleAnswer(Number(e.target.value))}
//                 >
//                   {questions[currentQuestion].options.map((option, index) => (
//                     <OptionButton
//                       key={index}
//                       value={index}
//                       control={<Radio />}
//                       label={<ContentRenderer content={option} />}
//                     />
//                   ))}
//                 </RadioGroup>
//               </QuestionCard>

//               <Box display="flex" justifyContent="space-between" mt={3}>
//                 <Button
//                   startIcon={<NavigateBefore />}
//                   onClick={() => setCurrentQuestion((prev) => prev - 1)}
//                   disabled={currentQuestion === 0}
//                 >
//                   Previous
//                 </Button>
//                 {currentQuestion === questions.length - 1 ? (
//                   <Button
//                     variant="contained"
//                     onClick={() => setShowResults(true)}
//                     disabled={selectedAnswers.includes(-1)}
//                   >
//                     Show Results
//                   </Button>
//                 ) : (
//                   <Button
//                     endIcon={<NavigateNext />}
//                     onClick={() => setCurrentQuestion((prev) => prev + 1)}
//                   >
//                     Next
//                   </Button>
//                 )}
//               </Box>
//             </Box>
//           ) : (
//             <Box>
//               <Typography variant="h4" gutterBottom>
//                 Score: {calculateScore()} / {questions.length}
//               </Typography>

//               {questions.map((question, index) => (
//                 <QuestionCard key={index}>
//                   <Box display="flex" alignItems="flex-start" gap={1}>
//                     {selectedAnswers[index] === question.answer ? (
//                       <Check color="success" sx={{ mt: 0.5 }} />
//                     ) : (
//                       <Clear color="error" sx={{ mt: 0.5 }} />
//                     )}
//                     <Box flex={1}>
//                       <ContentRenderer content={question.question} />
//                       <Box ml={4} mt={2}>
//                         <Typography color="success.main">
//                           Correct Answer:{" "}
//                           {String.fromCharCode(65 + question.answer)}
//                         </Typography>
//                         {selectedAnswers[index] !== question.answer && (
//                           <Typography color="error.main">
//                             Your Answer:{" "}
//                             {String.fromCharCode(65 + selectedAnswers[index])}
//                           </Typography>
//                         )}
//                       </Box>
//                     </Box>
//                   </Box>
//                 </QuestionCard>
//               ))}

//               <Box display="flex" justifyContent="space-between" mt={3}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => {
//                     setShowResults(false);
//                     setSelectedAnswers(new Array(questions.length).fill(-1));
//                     setCurrentQuestion(0);
//                   }}
//                 >
//                   Retry Quiz
//                 </Button>
//                 <Button
//                   variant="contained"
//                   startIcon={<Download />}
//                   onClick={handleDownloadPDF}
//                 >
//                   Download PDF
//                 </Button>
//               </Box>
//             </Box>
//           )}
//         </DialogContent>
//       </StyledDialog>
//     </>
//   );
// };

// export default EnhancedQuiz;
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close,
  NavigateNext,
  NavigateBefore,
  Download,
  Check,
  Clear,
} from '@mui/icons-material';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: '900px',
    width: '95vw',
    minHeight: '80vh',
    borderRadius: '16px',
    backgroundColor: theme.palette.background.default,
  },
}));

const QuestionCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2, 0),
  borderRadius: '12px',
  background: '#fff',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
}));

const OptionButton = styled(FormControlLabel)(({ theme }) => ({
  width: '100%',
  margin: theme.spacing(1, 0),
  '& .MuiRadio-root': {
    padding: theme.spacing(1),
  },
  '& .MuiTypography-root': {
    width: '100%',
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    border: `1px solid ${theme.palette.divider}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

interface QuizQuestion {
  type: string;
  question: string;
  answer: number;
  options: string[];
}

interface EnhancedQuizProps {
  questions: QuizQuestion[];
}

// Advanced Math Content Renderer
const MathRenderer: React.FC<{ tex: string, displayMode?: boolean }> = ({ tex, displayMode = false }) => {
  const containerRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(tex, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
          strict: false,
          macros: {
            "\\ce": "\\text",  // Handle chemical equations
          },
          fleqn: true,
        });
      } catch (error) {
        console.error('KaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = tex;
        }
      }
    }
  }, [tex, displayMode]);

  return <span ref={containerRef} />;
};

// Content Parser and Renderer
const ContentRenderer: React.FC<{ content: string }> = ({ content }) => {
  const segments = React.useMemo(() => {
    const parts = [];
    let currentText = '';
    let insideMath = false;
    let mathContent = '';
    let i = 0;

    const flushText = () => {
      if (currentText) {
        parts.push({ type: 'text', content: currentText });
        currentText = '';
      }
    };

    while (i < content.length) {
      if (!insideMath && content.slice(i, i + 2) === '\\(') {
        flushText();
        insideMath = true;
        mathContent = '';
        i += 2;
      } else if (insideMath && content.slice(i, i + 2) === '\\)') {
        parts.push({ type: 'math', content: mathContent, displayMode: false });
        insideMath = false;
        mathContent = '';
        i += 2;
      } else if (!insideMath && content.slice(i, i + 2) === '\\[') {
        flushText();
        insideMath = true;
        mathContent = '';
        i += 2;
      } else if (insideMath && content.slice(i, i + 2) === '\\]') {
        parts.push({ type: 'math', content: mathContent, displayMode: true });
        insideMath = false;
        mathContent = '';
        i += 2;
      } else {
        if (insideMath) {
          mathContent += content[i];
        } else {
          currentText += content[i];
        }
        i++;
      }
    }

    flushText();
    return parts;
  }, [content]);

  return (
    <Box sx={{ 
      fontSize: '1rem', 
      lineHeight: 1.6,
      '& .katex': {
        fontSize: '1.1em',
      },
      '& .katex-display': {
        margin: '1em 0',
        overflowX: 'auto',
        overflowY: 'hidden',
      }
    }}>
      {segments.map((segment, index) => {
        if (segment.type === 'math') {
          return (
            <MathRenderer 
              key={index} 
              tex={segment.content} 
              displayMode={segment.displayMode} 
            />
          );
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </Box>
  );
};

export const EnhancedQuiz: React.FC<EnhancedQuizProps> = ({ questions }) => {
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questions?.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleAnswer = (value: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = value;
    setSelectedAnswers(newAnswers);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => 
      score + (answer === questions[index].answer ? 1 : 0), 0);
  };

  const progress = (selectedAnswers.filter(a => a !== -1).length / questions.length) * 100;

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        fullWidth
        sx={{
          py: 2,
          borderRadius: 2,
          bgcolor: theme.palette.primary.main,
          '&:hover': {
            bgcolor: theme.palette.primary.dark,
          },
        }}
      >
        Start Quiz
      </Button>

      <StyledDialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {showResults ? 'Quiz Results' : `Question ${currentQuestion + 1} of ${questions.length}`}
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mt: 2 }}
          />
        </DialogTitle>

        <DialogContent>
          {!showResults ? (
            <Box>
              <QuestionCard elevation={2}>
                <Box sx={{ mb: 3 }}>
                  <ContentRenderer content={questions[currentQuestion].question} />
                </Box>
                <RadioGroup
                  value={selectedAnswers[currentQuestion]}
                  onChange={(e) => handleAnswer(Number(e.target.value))}
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <OptionButton
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={
                        <Box sx={{ width: '100%' }}>
                          <ContentRenderer content={option} />
                        </Box>
                      }
                    />
                  ))}
                </RadioGroup>
              </QuestionCard>

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  startIcon={<NavigateBefore />}
                  onClick={() => setCurrentQuestion(prev => prev - 1)}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setShowResults(true)}
                    disabled={selectedAnswers.includes(-1)}
                  >
                    Show Results
                  </Button>
                ) : (
                  <Button
                    endIcon={<NavigateNext />}
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography variant="h4" gutterBottom>
                Score: {calculateScore()} / {questions.length}
              </Typography>
              
              {questions.map((question, index) => (
                <QuestionCard key={index}>
                  <Box display="flex" alignItems="flex-start" gap={1}>
                    {selectedAnswers[index] === question.answer ? (
                      <Check color="success" sx={{ mt: 0.5 }} />
                    ) : (
                      <Clear color="error" sx={{ mt: 0.5 }} />
                    )}
                    <Box flex={1}>
                      <ContentRenderer content={question.question} />
                      <Box ml={4} mt={2}>
                        <Typography color="success.main" sx={{ mt: 2 }}>
                          Correct Answer: {String.fromCharCode(65 + question.answer)}
                        </Typography>
                        {selectedAnswers[index] !== question.answer && (
                          <Typography color="error.main">
                            Your Answer: {String.fromCharCode(65 + selectedAnswers[index])}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </QuestionCard>
              ))}

              <Box display="flex" justifyContent="space-between" mt={3}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowResults(false);
                    setSelectedAnswers(new Array(questions.length).fill(-1));
                    setCurrentQuestion(0);
                  }}
                >
                  Retry Quiz
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => window.print()}
                >
                  Download PDF
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </StyledDialog>
    </>
  );
};

export default EnhancedQuiz;