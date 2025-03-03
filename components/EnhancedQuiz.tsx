import React, { useState } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};
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
  Divider,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import {
  X as Close,
  ArrowRight as NavigateNext,
  ArrowLeft as NavigateBefore,
  Download,
  Check,
  X as Clear,
} from "lucide-react";
import katex from "katex";
import "katex/dist/katex.min.css";

const CodeBlock = ({ code }: { code: string }) => (
  <Box className="w-full my-4 rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
    <Box className="px-4 py-2 bg-gray-100 border-b border-gray-200">
      <Typography className="text-sm text-gray-600">code snippet</Typography>
    </Box>
    <Box className="p-4 overflow-x-auto">
      <pre className="text-sm font-mono whitespace-pre-wrap">{code}</pre>
    </Box>
  </Box>
);

const ContentRenderer = ({ content }: { content: string }) => {
  const segments = React.useMemo(() => {
    const codePattern = /```(\w*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codePattern.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
        });
      }

      // Add code block
      parts.push({
        type: "code",
        content: match[2].trim(),
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex),
      });
    }

    return parts;
  }, [content]);

  return (
    <Box className="text-base leading-relaxed">
      {segments.map((segment, index) => {
        if (segment.type === "code") {
          return <CodeBlock key={index} code={segment.content} />;
        }
        return <span key={index}>{segment.content}</span>;
      })}
    </Box>
  );
};

const QuizConfigDialog: React.FC<{
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}> = ({ open, onClose, onSubmit }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>
      <Typography className="text-xl font-semibold">
        Quiz Configuration
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Box className="space-y-4">
        <Box>
          <Typography className="mb-2">Quiz Mode</Typography>
          <Select defaultValue="online" className="w-full">
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="offline">Offline (PDF)</MenuItem>
          </Select>
        </Box>
        <Box>
          <Typography className="mb-2">Duration (minutes)</Typography>
          <TextField type="number" defaultValue={30} className="w-full" />
        </Box>
        <Box>
          <Typography className="mb-2">Marks per Question</Typography>
          <TextField type="number" defaultValue={1} className="w-full" />
        </Box>
        <Box>
          <Typography className="mb-2">Quiz Date</Typography>
          <TextField type="date" className="w-full" />
        </Box>
        <Button variant="contained" onClick={onSubmit} className="w-full mt-4">
          Start Quiz
        </Button>
      </Box>
    </DialogContent>
  </Dialog>
);

const EnhancedQuiz = ({ questions }: { questions: QuizQuestion[] }) => {
  const [open, setOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(
    new Array(questions?.length).fill(-1)
  );
  const [showResults, setShowResults] = useState(false);

  const handleQuizStart = () => {
    setConfigOpen(true);
  };

  const handleConfigSubmit = () => {
    setConfigOpen(false);
    setOpen(true);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce(
      (score, answer, index) =>
        score + (answer === questions[index].answer ? 1 : 0),
      0
    );
  };

  const progress =
    (selectedAnswers.filter((a) => a !== -1).length / questions.length) * 100;

  return (
    <>
      <Button
        variant="contained"
        onClick={handleQuizStart}
        className="w-full py-4 rounded-lg bg-black hover:bg-gray-900 text-white"
      >
        Start Quiz
      </Button>

      <QuizConfigDialog
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        onSubmit={handleConfigSubmit}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="rounded-xl bg-slate-400"
        // maxWidth="lg"
      >
        <DialogTitle className="border-b border-gray-200">
          <Box className="flex justify-between items-center">
            <Typography className="text-xl font-semibold">
              {showResults
                ? "Quiz Results"
                : `Question ${currentQuestion + 1} of ${questions.length}`}
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close className="h-6 w-6" />
            </IconButton>
          </Box>
          <LinearProgress value={progress} className="mt-4" />
        </DialogTitle>

        <DialogContent>
          {!showResults ? (
            <Box>
              <Paper className="p-6 my-4 rounded-xl border border-gray-200">
                <Box className="mb-6">
                  <ContentRenderer
                    content={questions[currentQuestion].question}
                  />
                </Box>
                <RadioGroup
                  value={selectedAnswers[currentQuestion]}
                  onChange={(e) => {
                    const newAnswers = [...selectedAnswers];
                    newAnswers[currentQuestion] = Number(e.target.value);
                    setSelectedAnswers(newAnswers);
                  }}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={
                        <Box className="w-full p-4 border border-gray-200 rounded-lg">
                          <ContentRenderer content={option} />
                        </Box>
                      }
                      className="w-full m-0"
                    />
                  ))}
                </RadioGroup>
              </Paper>

              <Box className="flex justify-between mt-6">
                <Button
                  onClick={() => setCurrentQuestion((prev) => prev - 1)}
                  disabled={currentQuestion === 0}
                  className="flex items-center"
                >
                  <NavigateBefore className="h-5 w-5 mr-2" />
                  Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={() => setShowResults(true)}
                    disabled={selectedAnswers.includes(-1)}
                    className="bg-black hover:bg-gray-900"
                  >
                    Show Results
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion((prev) => prev + 1)}
                    className="flex items-center"
                  >
                    Next
                    <NavigateNext className="h-5 w-5 ml-2" />
                  </Button>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Typography className="text-2xl font-semibold mb-6">
                Score: {calculateScore()} / {questions.length}
              </Typography>

              {questions.map((question, index) => (
                <Paper
                  key={index}
                  className="p-6 mb-4 rounded-xl border border-gray-200"
                >
                  <Box className="flex gap-4">
                    {selectedAnswers[index] === question.answer ? (
                      <Check className="h-6 w-6 text-green-600 mt-1" />
                    ) : (
                      <Clear className="h-6 w-6 text-red-600 mt-1" />
                    )}
                    <Box className="flex-1">
                      <ContentRenderer content={question.question} />
                      <Box className="ml-8 mt-4">
                        <Typography className="text-green-600 font-medium">
                          Correct Answer:{" "}
                          {String.fromCharCode(65 + question.answer)}
                        </Typography>
                        {selectedAnswers[index] !== question.answer && (
                          <Typography className="text-red-600">
                            Your Answer:{" "}
                            {String.fromCharCode(65 + selectedAnswers[index])}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              ))}

              <Box className="flex justify-between mt-6">
                <Button
                  variant="outlined"
                  onClick={() => {
                    setShowResults(false);
                    setSelectedAnswers(new Array(questions.length).fill(-1));
                    setCurrentQuestion(0);
                  }}
                  className="border-black text-black hover:bg-gray-50"
                >
                  Retry Quiz
                </Button>
                <Button
                  variant="contained"
                  onClick={() => window.print()}
                  className="bg-black hover:bg-gray-900"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Results
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedQuiz;
