"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import {
  Box,
  Button,
  Paper,
  Typography,
  Avatar,
  Divider,
  IconButton,
  LinearProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
  Chip,
  useMediaQuery,
  useTheme,
  Drawer,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  Timer,
  AlertCircle,
  Flag,
  LogOut,
  CheckCircle,
  XCircle,
  Menu,
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
} from "lucide-react";
import Image from "next/image";

interface Question {
  type: string;
  answer: number;
  options: Array<{ text: string; code?: string }>;
  question: {
    text: string;
    code?: string;
    assertion?: string;
    reason?: string;
  };
}

interface Quiz {
  id: string;
  title: string;
  duration: number;
  questions: Question[];
  marksPerQuestion: number;
}

interface SessionObject {
  id: string | undefined | null;
  image: string | undefined | null;
  name: string | undefined | null;
  email: string | undefined | null;
}

export default function QuizPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<SessionObject | null>();
  const params = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [markForReview, setMarkForReview] = useState<Set<number>>(new Set());
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [animateQuestion, setAnimateQuestion] = useState(false);
  const [timeWarning, setTimeWarning] = useState(false);

  // Load quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${params?.quizId}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error);
          return;
        }

        setQuiz(data);
        setTimeLeft(data.duration * 60);
      } catch (error) {
        setError("Failed to fetch quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [params?.quizId]);

  // Get session data
  useEffect(() => {
    const getData = async () => {
      const info = await getSession();
      setData({
        id: info?.user?.id,
        image: info?.user?.image,
        name: info?.user?.name,
        email: info?.user?.email,
      });
      console.log("image", info?.user?.image);
    };
    getData();
  }, []);

  // Handle drawer state based on screen size
  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  // Animate question transition
  useEffect(() => {
    setAnimateQuestion(true);
    const timer = setTimeout(() => setAnimateQuestion(false), 300);
    return () => clearTimeout(timer);
  }, [currentQuestion]);

  // Show warning when time is running low (less than 5 minutes)
  useEffect(() => {
    if (timeLeft <= 300 && timeLeft > 0) {
      setTimeWarning(true);
    }
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      const response = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
        }),
      });
      if (response.ok) {
        router.push(`/dashboard`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const toggleMarkForReview = () => {
    const newMarked = new Set(markForReview);
    if (newMarked.has(currentQuestion)) {
      newMarked.delete(currentQuestion);
    } else {
      newMarked.add(currentQuestion);
    }
    setMarkForReview(newMarked);
  };

  const navigateQuestion = (direction: "prev" | "next") => {
    if (!quiz) return;

    if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (
      direction === "next" &&
      currentQuestion < quiz.questions.length - 1
    ) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 4, fontWeight: 600, color: "#000000" }}
        >
          Loading Quiz...
        </Typography>
        <LinearProgress
          sx={{
            width: isSmall ? "80%" : "40%",
            height: 8,
            borderRadius: 4,
            mb: 2,
            bgcolor: "rgba(0,0,0,0.1)",
            "& .MuiLinearProgress-bar": {
              bgcolor: "#000000",
            },
          }}
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          }}
        >
          <AlertCircle
            size={64}
            color="black"
            style={{ marginBottom: 24, opacity: 0.9 }}
            className="mx-auto"
          />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
            {error}
          </Typography>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white font-medium px-6 py-3 rounded-lg hover:bg-gray-800 transition-all"
            style={{
              outline: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Back to Dashboard
          </button>
        </Paper>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="sm" sx={{ pt: 8 }}>
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3 }}>
          <XCircle size={48} color="black" style={{ marginBottom: 16 }} />
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Quiz not found
          </Typography>
        </Paper>
      </Container>
    );
  }

  const completionStatus = {
    total: quiz.questions.length,
    answered: Object.keys(answers).length,
    marked: markForReview.size,
    remaining: quiz.questions.length - Object.keys(answers).length,
  };

  const getQuestionStatus = (index: number) => {
    if (currentQuestion === index) return "current";
    if (markForReview.has(index)) return "review";
    if (answers[index] !== undefined) return "answered";
    return "notVisited";
  };

  // Dynamic drawer width based on screen size
  const drawerWidth = isMobile ? "100%" : 330;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", position: "relative" }}>
      {/* Header Bar */}
      <Paper
        elevation={0}
        sx={{
          px: { xs: 2, sm: 4 },
          py: 1.5,
          bgcolor: "#000000",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          borderRadius: 0,
        }}
      >
        <Grid container alignItems="center" spacing={1}>
          <Grid item xs={isMobile ? 2 : 3}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  onClick={() => setDrawerOpen(true)}
                  sx={{ mr: 1 }}
                >
                  <Menu size={22} />
                </IconButton>
              )}
              <Typography
                variant={isMobile ? "body1" : "h6"}
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "0.9rem", sm: "1.1rem", md: "1.2rem" },
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {quiz.title}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={isMobile ? 7 : 6} sx={{ textAlign: "center" }}>
            <Tooltip
              title={timeWarning ? "Less than 5 minutes remaining!" : ""}
            >
              <Chip
                icon={<Clock size={18} />}
                label={formatTime(timeLeft)}
                sx={{
                  bgcolor: timeWarning ? "rgba(255,255,255,0.9)" : "white",
                  color: timeWarning ? "#d32f2f" : "black",
                  fontFamily: "monospace",
                  fontSize: { xs: "0.9rem", sm: "1.1rem" },
                  fontWeight: 600,
                  height: { xs: 32, sm: 40 },
                  px: { xs: 1, sm: 1.5 },
                  "& .MuiChip-icon": {
                    color: timeWarning ? "#d32f2f" : "black",
                    animation: timeWarning ? "pulse 1.5s infinite" : "none",
                  },
                  "@keyframes pulse": {
                    "0%": { opacity: 0.7 },
                    "50%": { opacity: 1 },
                    "100%": { opacity: 0.7 },
                  },
                }}
              />
            </Tooltip>
          </Grid>

          <Grid item xs={isMobile ? 3 : 3} sx={{ textAlign: "right" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: { xs: 1, sm: 2 },
              }}
            >
              <Image
                src={data?.image || "/default-image.png"}
                alt={data?.name || "User"}
                width={40}
                height={40}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                }}
              />
              <IconButton
                color="inherit"
                onClick={() => router.push("/api/auth/signout")}
                sx={{
                  bgcolor: "rgba(255,255,255,0.1)",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
                }}
              >
                <LogOut size={isMobile ? 18 : 20} />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Content */}
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 2, sm: 4 },
          px: { xs: 2, sm: 3, md: 4 },
          display: "flex",
          position: "relative",
        }}
      >
        {/* Question Content */}
        <Box
          sx={{
            width: "100%",
            transition: "margin 0.3s ease",
            ml: !isMobile && drawerOpen ? `${drawerWidth}px` : 0,
          }}
        >
          {/* <Fade in={animateQuestion}> */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              mb: 3,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              transition: "all 0.3s ease",
              bgcolor: "#ffffff",
            }}
          >
            {/* Question Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                flexWrap: { xs: "wrap", sm: "nowrap" },
                gap: { xs: 1, sm: 0 },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                }}
              >
                Question {currentQuestion + 1} of {quiz.questions.length}
              </Typography>

              <Button
                startIcon={<Flag size={18} />}
                variant="outlined"
                size={isSmall ? "small" : "medium"}
                onClick={toggleMarkForReview}
                sx={{
                  borderColor: markForReview.has(currentQuestion)
                    ? "#ff9800"
                    : "rgba(0,0,0,0.3)",
                  color: markForReview.has(currentQuestion)
                    ? "#ff9800"
                    : "rgba(0,0,0,0.7)",
                  "&:hover": {
                    borderColor: markForReview.has(currentQuestion)
                      ? "#e65100"
                      : "rgba(0,0,0,0.5)",
                    bgcolor: "rgba(0,0,0,0.03)",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  px: { xs: 1.5, sm: 2 },
                  py: { xs: 0.5, sm: 0.75 },
                  borderRadius: 2,
                }}
              >
                {markForReview.has(currentQuestion)
                  ? isSmall
                    ? "Marked"
                    : "Marked for Review"
                  : isSmall
                  ? "Mark"
                  : "Mark for Review"}
              </Button>
            </Box>

            <Divider sx={{ my: 2, borderColor: "rgba(0,0,0,0.07)" }} />

            {/* Question Content */}
            <Box sx={{ mb: 4 }}>
              {quiz.questions[currentQuestion]?.question?.assertion && (
                <Paper
                  elevation={0}
                  sx={{
                    mb: 3,
                    p: 2.5,
                    bgcolor: "rgba(0,0,0,0.02)",
                    borderRadius: 2,
                    border: "1px solid rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                      lineHeight: 1.7,
                      color: "rgba(0,0,0,0.85)",
                      display: "flex",
                      flexFlow: "column",
                      gap: 2,
                    }}
                  >
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: "rgba(0,0,0,0.7)",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Assertion:
                      </Typography>
                      <Typography component="span">
                        {quiz.questions[currentQuestion].question.assertion}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        component="span"
                        sx={{
                          fontWeight: 600,
                          color: "rgba(0,0,0,0.7)",
                          display: "block",
                          mb: 0.5,
                        }}
                      >
                        Reason:
                      </Typography>
                      <Typography component="span">
                        {quiz.questions[currentQuestion].question.reason}
                      </Typography>
                    </Box>
                  </Typography>
                </Paper>
              )}

              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.7,
                  color: "rgba(0,0,0,0.9)",
                  fontWeight: 500,
                }}
              >
                {quiz.questions[currentQuestion].question.text}
              </Typography>
            </Box>

            {/* Code Block */}
            {quiz?.questions[currentQuestion]?.question?.code && (
              <Box
                sx={{
                  width: "100%",
                  my: 3,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "#f5f5f5",
                  border: "1px solid rgba(0,0,0,0.1)",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: "#e0e0e0",
                    borderBottom: "1px solid rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "rgba(0,0,0,0.7)",
                      fontFamily: "monospace",
                      fontWeight: 500,
                    }}
                  >
                    {
                      quiz?.questions[currentQuestion].question.code.split(
                        "\n"
                      )[0]
                    }
                  </Typography>
                </Box>
                <Box sx={{ p: 2, overflow: "auto", maxHeight: "350px" }}>
                  <pre
                    style={{
                      margin: 0,
                      fontSize: isSmall ? "0.75rem" : "0.875rem",
                      fontFamily: "Monaco, monospace",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {quiz.questions[currentQuestion].question.code
                      .split("\n")
                      .slice(1)
                      .join("\n")}
                  </pre>
                </Box>
              </Box>
            )}

            {/* Options */}
            <Box sx={{ mt: 4 }}>
              {quiz.questions[currentQuestion].options.map((option, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    mb: 2,
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 2,
                    fontWeight: answers[currentQuestion] === index ? 600 : 400,
                    color:
                      answers[currentQuestion] === index
                        ? "#000000"
                        : "rgba(0,0,0,0.85)",
                    borderColor:
                      answers[currentQuestion] === index
                        ? "#000000"
                        : "rgba(0,0,0,0.2)",
                    bgcolor:
                      answers[currentQuestion] === index
                        ? "rgba(0,0,0,0.03)"
                        : "transparent",
                    boxShadow:
                      answers[currentQuestion] === index
                        ? "0 2px 8px rgba(0,0,0,0.08)"
                        : "none",
                    "&:hover": {
                      bgcolor:
                        answers[currentQuestion] === index
                          ? "rgba(0,0,0,0.05)"
                          : "rgba(0,0,0,0.02)",
                      borderColor:
                        answers[currentQuestion] === index
                          ? "#000000"
                          : "rgba(0,0,0,0.4)",
                    },
                    transition: "all 0.2s ease-in-out",
                  }}
                  onClick={() => handleAnswerSelect(currentQuestion, index)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        minWidth: 28,
                        fontWeight: 600,
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                        color:
                          answers[currentQuestion] === index
                            ? "#000000"
                            : "rgba(0,0,0,0.6)",
                        mr: 1,
                      }}
                    >
                      {String.fromCharCode(65 + index)}.
                    </Typography>
                    <Typography
                      sx={{
                        flex: 1,
                        fontWeight:
                          answers[currentQuestion] === index ? 500 : 400,
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                      }}
                    >
                      {option?.text
                        ? option.text
                        : typeof option === "string"
                        ? option
                        : ""}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </Box>

            {/* Navigation Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                pt: 2,
                borderTop: "1px solid rgba(0,0,0,0.07)",
              }}
            >
              <Button
                startIcon={<ChevronLeft />}
                variant="outlined"
                disabled={currentQuestion === 0}
                onClick={() => navigateQuestion("prev")}
                sx={{
                  borderColor: "rgba(0,0,0,0.3)",
                  color: "rgba(0,0,0,0.7)",
                  "&:hover": {
                    borderColor: "rgba(0,0,0,0.7)",
                    bgcolor: "rgba(0,0,0,0.03)",
                  },
                  "&.Mui-disabled": {
                    borderColor: "rgba(0,0,0,0.1)",
                    color: "rgba(0,0,0,0.3)",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 2,
                }}
              >
                Previous
              </Button>

              <Button
                endIcon={<ChevronRight />}
                variant="contained"
                // disabled={currentQuestion === quiz.questions.length - 1}
                onClick={() => {
                  if (currentQuestion === quiz.questions.length - 1) {
                    setConfirmSubmit(true);
                    return;
                  }
                  navigateQuestion("next");
                }}
                sx={{
                  bgcolor: "#000000",
                  color: "#ffffff",
                  "&:hover": {
                    bgcolor: "#333333",
                  },
                  "&.Mui-disabled": {
                    bgcolor: "rgba(0,0,0,0.1)",
                    color: "white",
                  },
                  textTransform: "none",
                  fontWeight: 500,
                  borderRadius: 2,
                }}
                style={{
                  backgroundColor: "black",
                }}
              >
                {currentQuestion === quiz.questions.length - 1
                  ? "Submit"
                  : "Next"}
              </Button>
            </Box>
          </Paper>
          {/* </Fade> */}

          {/* Submit Button (Mobile) */}
          {isMobile && (
            <Button
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                borderRadius: 2,
                mb: 4,
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
              style={{
                backgroundColor: "black",
              }}
              onClick={() => setConfirmSubmit(true)}
            >
              Submit Quiz
            </Button>
          )}
        </Box>

        {/* Question Panel (Drawer for mobile, fixed sidebar for desktop) */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: drawerWidth,
                p: 2,
                bgcolor: "#ffffff",
              },
            }}
          >
            <QuestionPanelContent
              quiz={quiz}
              currentQuestion={currentQuestion}
              answers={answers}
              markForReview={markForReview}
              setCurrentQuestion={(index) => {
                setCurrentQuestion(index);
                if (isMobile) setDrawerOpen(false);
              }}
              completionStatus={completionStatus}
              getQuestionStatus={getQuestionStatus}
              handleConfirmSubmit={() => setConfirmSubmit(true)}
              isSmall={isSmall}
              isMobile={isMobile}
              closeDrawer={() => setDrawerOpen(false)}
            />
          </Drawer>
        ) : (
          <Box
            sx={{
              position: "fixed",
              top: 76,
              left: drawerOpen ? 0 : -drawerWidth,
              width: drawerWidth,
              height: "calc(100vh - 76px)",
              transition: "left 0.3s ease",
              p: 3,
              overflow: "auto",
              bgcolor: "#ffffff",
              borderRight: "1px solid rgba(0,0,0,0.08)",
              zIndex: 1000,
            }}
          >
            <QuestionPanelContent
              quiz={quiz}
              currentQuestion={currentQuestion}
              answers={answers}
              markForReview={markForReview}
              setCurrentQuestion={setCurrentQuestion}
              completionStatus={completionStatus}
              getQuestionStatus={getQuestionStatus}
              handleConfirmSubmit={() => setConfirmSubmit(true)}
              isSmall={isSmall}
              isMobile={isMobile}
            />
          </Box>
        )}
      </Container>

      {/* Submit Confirmation Dialog */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxWidth: 450,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            p: 2,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#000000" }}>
            Confirm Submission
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body1"
              sx={{ mb: 3, color: "rgba(0,0,0,0.8)" }}
            >
              Are you sure you want to submit the quiz?
            </Typography>

            <Box
              sx={{
                bgcolor: "rgba(0,0,0,0.03)",
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{ mb: 1, color: "#000000" }}
                    >
                      {completionStatus.answered}
                    </Typography>
                    <Typography variant="body2" color="rgba(0,0,0,0.6)">
                      Answered
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box sx={{ textAlign: "center", p: 1 }}>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{
                        mb: 1,
                        color:
                          completionStatus.remaining > 0
                            ? "#d32f2f"
                            : "#000000",
                      }}
                    >
                      {completionStatus.remaining}
                    </Typography>
                    <Typography variant="body2" color="rgba(0,0,0,0.6)">
                      Unanswered
                    </Typography>
                  </Box>
                </Grid>

                {completionStatus.marked > 0 && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1, borderColor: "rgba(0,0,0,0.1)" }} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 1,
                      }}
                    >
                      <Info
                        size={16}
                        color="#ff9800"
                        style={{ marginRight: 8 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "#ff9800", fontWeight: 500 }}
                      >
                        {completionStatus.marked} questions marked for review
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>

          {completionStatus.remaining > 0 && (
            <Box
              sx={{
                bgcolor: "rgba(211, 47, 47, 0.05)",
                p: 2,
                borderRadius: 2,
                border: "1px solid rgba(211, 47, 47, 0.2)",
                mb: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <AlertCircle
                size={20}
                color="#d32f2f"
                style={{ marginRight: 8, flexShrink: 0 }}
              />
              <Typography variant="body2" sx={{ color: "#d32f2f" }}>
                You have {completionStatus.remaining} unanswered questions. Are
                you sure you want to proceed?
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button
            onClick={() => setConfirmSubmit(false)}
            sx={{
              color: "rgba(0,0,0,0.7)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.05)" },
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Continue Quiz
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#000000",
              // "&:hover": { bgcolor: "#333333" },
              textTransform: "none",
              fontWeight: 500,
            }}
            style={{
              backgroundColor: "black",
            }}
          >
            Submit Quiz
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Question Panel Component
function QuestionPanelContent({
  quiz,
  currentQuestion,
  answers,
  markForReview,
  setCurrentQuestion,
  completionStatus,
  getQuestionStatus,
  handleConfirmSubmit,
  isSmall,
  isMobile,
  closeDrawer,
}: {
  quiz: Quiz;
  currentQuestion: number;
  answers: Record<string, number>;
  markForReview: Set<number>;
  setCurrentQuestion: (index: number) => void;
  completionStatus: {
    total: number;
    answered: number;
    marked: number;
    remaining: number;
  };
  getQuestionStatus: (index: number) => string;
  handleConfirmSubmit: () => void;
  isSmall: boolean;
  isMobile: boolean;
  closeDrawer?: () => void;
}) {
  if (!quiz) return null;

  return (
    <Box sx={{ height: "100%" }}>
      {/* Mobile Header with Close Button */}
      {isMobile && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            pb: 2,
            borderBottom: "1px solid rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Questions
          </Typography>
          <IconButton onClick={closeDrawer} size="small">
            <ChevronLeft />
          </IconButton>
        </Box>
      )}

      {/* Progress Summary */}
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 3,
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.08)",
          bgcolor: "rgba(0,0,0,0.02)",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            fontSize: isSmall ? "0.9rem" : "1rem",
            color: "rgba(0,0,0,0.8)",
          }}
        >
          Quiz Progress
        </Typography>

        <Box sx={{ display: "flex", mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="body2"
              sx={{
                mb: 0.5,
                color: "rgba(0,0,0,0.6)",
                fontSize: isSmall ? "0.75rem" : "0.875rem",
              }}
            >
              Completion
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completionStatus.answered / completionStatus.total) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "rgba(0,0,0,0.1)",
                mb: 0.5,
                "& .MuiLinearProgress-bar": {
                  bgcolor: "#000000",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "rgba(0,0,0,0.7)",
                fontWeight: 500,
                fontSize: isSmall ? "0.7rem" : "0.75rem",
              }}
            >
              {completionStatus.answered} of {completionStatus.total} answered
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mt: 2,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: isSmall ? "1.1rem" : "1.25rem",
                fontWeight: 700,
                color: "#000000",
                mb: 0.5,
              }}
            >
              {completionStatus.answered}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(0,0,0,0.6)",
                fontSize: isSmall ? "0.7rem" : "0.75rem",
              }}
            >
              Answered
            </Typography>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              textAlign: "center",
              p: 1.5,
              borderRadius: 2,
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: "#ffffff",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontSize: isSmall ? "1.1rem" : "1.25rem",
                fontWeight: 700,
                color: completionStatus.remaining > 0 ? "#d32f2f" : "#000000",
                mb: 0.5,
              }}
            >
              {completionStatus.remaining}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: "rgba(0,0,0,0.6)",
                fontSize: isSmall ? "0.7rem" : "0.75rem",
              }}
            >
              Remaining
            </Typography>
          </Paper>

          {completionStatus.marked > 0 && (
            <Paper
              elevation={0}
              sx={{
                textAlign: "center",
                p: 1.5,
                borderRadius: 2,
                border: "1px solid rgba(255,152,0,0.3)",
                bgcolor: "rgba(255,152,0,0.05)",
                gridColumn: "1 / span 2",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: isSmall ? "1.1rem" : "1.25rem",
                  fontWeight: 700,
                  color: "#ff9800",
                  mb: 0.5,
                }}
              >
                {completionStatus.marked}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(0,0,0,0.7)",
                  fontSize: isSmall ? "0.7rem" : "0.75rem",
                }}
              >
                Marked for Review
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>

      {/* Question List */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            fontWeight: 600,
            fontSize: isSmall ? "0.9rem" : "1rem",
            color: "rgba(0,0,0,0.8)",
          }}
        >
          Question Navigator
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1.5,
          }}
        >
          {Array.from({ length: quiz.questions.length }).map((_, index) => {
            const status = getQuestionStatus(index);
            let bgColor = "#ffffff";
            let borderColor = "rgba(0,0,0,0.2)";
            let textColor = "rgba(0,0,0,0.8)";

            if (status === "current") {
              bgColor = "#000000";
              borderColor = "#000000";
              textColor = "black";
            } else if (status === "answered") {
              bgColor = "rgba(0,0,0,0.05)";
              borderColor = "#000000";
              textColor = "#000000";
            } else if (status === "review") {
              bgColor = "rgba(255,152,0,0.1)";
              borderColor = "#ff9800";
              textColor = "#ff9800";
            }

            return (
              <Button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                sx={{
                  minWidth: 0,
                  width: "100%",
                  height: { xs: 36, sm: 42 },
                  p: 0,
                  bgcolor: bgColor,
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 1.5,
                  fontWeight: 600,
                  "&:hover": {
                    bgcolor:
                      status === "current" ? "#333333" : "rgba(0,0,0,0.07)",
                    color: status === "current" ? "white" : "rgba(0,0,0,0.8)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {index + 1}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Legend */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          borderRadius: 2,
          border: "1px solid rgba(0,0,0,0.08)",
          bgcolor: "#ffffff",
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 600,
            fontSize: isSmall ? "0.8rem" : "0.9rem",
            color: "rgba(0,0,0,0.7)",
          }}
        >
          Status Legend
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: "#000000",
                mr: 1.5,
              }}
            />
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
              Current Question
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: "rgba(0,0,0,0.05)",
                border: "1px solid #000000",
                mr: 1.5,
              }}
            />
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
              Answered
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: "rgba(255,152,0,0.1)",
                border: "1px solid #ff9800",
                mr: 1.5,
              }}
            />
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
              Marked for Review
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: 1,
                bgcolor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.2)",
                mr: 1.5,
              }}
            />
            <Typography variant="body2" sx={{ color: "rgba(0,0,0,0.7)" }}>
              Not Visited
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Submit Button */}
      {!isMobile && (
        <Button
          fullWidth
          variant="contained"
          sx={{
            py: 1.5,
            borderRadius: 2,
            mb: 4,
            mt: "auto",
            fontSize: "1rem",
            fontWeight: 600,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
          style={{ backgroundColor: "black" }}
          onClick={handleConfirmSubmit}
        >
          Submit Quiz
        </Button>
      )}
    </Box>
  );
}
