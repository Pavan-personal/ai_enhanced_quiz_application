"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession, useSession } from "next-auth/react";
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
} from "@mui/material";
import {
  Timer,
  AlertCircle,
  Flag,
  LogOut,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { User } from "next-auth";
import { Session } from "@clerk/nextjs/server";

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

export default function QuizPage() {
  const [data, setData] = useState<SessionObject | null>();
  useEffect(() => {
    const getData = async () => {
      const info = await getSession();
      setData({
        id: info?.user?.id,
        image: info?.user.image,
        name: info?.user.name,
        email: info?.user?.email,
      });
    };
    getData();
  }, []);
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

  useEffect(() => {
    const getData = async () => {
      const info = await getSession();
      setData({
        id: info?.user?.id,
        image: info?.user.image,
        name: info?.user.name,
        email: info?.user?.email,
      });
    };
    getData();
  }, []);

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
        router.push(`/quiz/${quiz.id}/result`);
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
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "black",
        }}
      >
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ height: "100vh", display: "flex",justifyContent: "center", alignItems: "center" }}>
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <AlertCircle
            size={48}
            color="red"
            style={{ marginBottom: 16 }}
            className="mx-auto"
          />
          <Typography variant="h5" gutterBottom>
            {error}
          </Typography>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white font-medium px-6 py-3 rounded-md"
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
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <XCircle size={48} color="red" style={{ marginBottom: 16 }} />
          <Typography variant="h5">Quiz not found</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          px: 4,
          py: 2,
          bgcolor: "black",
          color: "white",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          borderRadius: 0,
        }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={3}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {quiz.title}
            </Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: "center" }}>
            <Chip
              icon={<Timer size={20} />}
              label={formatTime(timeLeft)}
              sx={{
                bgcolor: "white",
                color: "black",
                fontFamily: "monospace",
                fontSize: "1.2rem",
                height: 40,
                "& .MuiChip-icon": { color: "black" },
              }}
            />
          </Grid>
          <Grid item xs={3} sx={{ textAlign: "right" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Avatar
                src={data?.image || undefined}
                alt={data?.name || "User"}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid white",
                }}
              />
              <IconButton
                color="inherit"
                onClick={() => router.push("/api/auth/signout")}
              >
                <LogOut />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Question Section */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </Typography>
                <Button
                  startIcon={<Flag />}
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const newMarked = new Set(markForReview);
                    if (newMarked.has(currentQuestion)) {
                      newMarked.delete(currentQuestion);
                    } else {
                      newMarked.add(currentQuestion);
                    }
                    setMarkForReview(newMarked);
                  }}
                  sx={{
                    borderColor: markForReview.has(currentQuestion)
                      ? "warning.main"
                      : "grey.300",
                    color: markForReview.has(currentQuestion)
                      ? "warning.main"
                      : "grey.700",
                    "&:hover": {
                      borderColor: markForReview.has(currentQuestion)
                        ? "warning.dark"
                        : "grey.400",
                      bgcolor: "grey.50",
                    },
                  }}
                >
                  {markForReview.has(currentQuestion)
                    ? "Marked for Review"
                    : "Mark for Review"}
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Question Text */}
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  fontSize: "1.1rem",
                  lineHeight: 1.6,
                  color: "grey.900",
                }}
              >
                {quiz.questions[currentQuestion].question.text}
              </Typography>

              {/* Code Block if exists */}
              {quiz.questions[currentQuestion].question.code && (
                <Box
                  sx={{
                    width: "100%",
                    my: 3,
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "grey.50",
                    border: "1px solid",
                    borderColor: "grey.200",
                  }}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: "grey.100",
                      borderBottom: "1px solid",
                      borderColor: "grey.200",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Code Snippet
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2, overflow: "auto" }}>
                    <pre
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        fontFamily: "Monaco, monospace",
                        lineHeight: 1.5,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {quiz.questions[currentQuestion].question.code}
                    </pre>
                  </Box>
                </Box>
              )}

              {/* Options */}
              <Box sx={{ mt: 4 }}>
                {quiz.questions[currentQuestion].options.map(
                  (option, index) => (
                    <Button
                      key={index}
                      variant={
                        "outlined"
                      }
                      sx={{
                        width: "100%",
                        justifyContent: "flex-start",
                        textAlign: "left",
                        mb: 2,
                        p: 2.5,
                        borderRadius: 2,
                        color:
                          answers[currentQuestion] === index
                            ? "white"
                            : "grey.900",
                        bgcolor:
                          answers[currentQuestion] === index
                            ? "black"
                            : "white",
                        borderColor:
                          answers[currentQuestion] === index
                            ? "black"
                            : "grey.300",
                        "&:hover": {
                          bgcolor:
                            answers[currentQuestion] === index
                              ? "grey.900"
                              : "grey.50",
                          borderColor:
                            answers[currentQuestion] === index
                              ? "black"
                              : "grey.400",
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
                            minWidth: 24,
                            fontWeight: 500,
                            color:
                              answers[currentQuestion] === index
                                ? "white"
                                : "grey.600",
                          }}
                        >
                          {String.fromCharCode(65 + index)}.
                        </Typography>
                        <Typography
                          sx={{
                            flex: 1,
                            fontWeight:
                              answers[currentQuestion] === index ? 500 : 400,
                          }}
                        >
                          {option.text}
                        </Typography>
                      </Box>
                    </Button>
                  )
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Question Panel with updated styling */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                Question Panel
              </Typography>

              <Grid container spacing={1}>
                {quiz.questions.map((_, index) => (
                  <Grid item xs={3} key={index}>
                    <Button
                      sx={{
                        minWidth: 0,
                        width: "100%",
                        aspectRatio: "1",
                        p: 0,
                        borderRadius: 1.5,
                        color: markForReview.has(index)
                          ? "warning.main"
                          : answers[index] !== undefined
                          ? "success.main"
                          : "grey.500",
                        borderColor: markForReview.has(index)
                          ? "warning.main"
                          : answers[index] !== undefined
                          ? "success.main"
                          : "grey.300",
                        bgcolor:
                          currentQuestion === index ? "black" : "transparent",
                        "&:hover": {
                          bgcolor:
                            currentQuestion === index ? "grey.900" : "grey.50",
                        },
                        "& .MuiTypography-root": {
                          color:
                            currentQuestion === index
                              ? "white"
                              : markForReview.has(index)
                              ? "warning.main"
                              : answers[index] !== undefined
                              ? "success.main"
                              : "grey.700",
                        },
                      }}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {index + 1}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: "grey.700" }}
                >
                  Legend:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: "success.main",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" color="grey.600">
                        Answered
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: "grey.400",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" color="grey.600">
                        Not Visited
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          bgcolor: "warning.main",
                          borderRadius: "50%",
                        }}
                      />
                      <Typography variant="body2" color="grey.600">
                        Marked for Review
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "black",
                py: 1.5,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "grey.900",
                },
              }}
              onClick={() => setConfirmSubmit(true)}
            >
              Submit Quiz
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* Submit Confirmation Dialog with updated styling */}
      <Dialog
        open={confirmSubmit}
        onClose={() => setConfirmSubmit(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            Confirm Submission
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Are you sure you want to submit the quiz?
            </Typography>
            <Box sx={{ bgcolor: "grey.50", p: 2, borderRadius: 1 }}>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography variant="body2" color="grey.700">
                  Answered Questions:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {Object.keys(answers).length}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="grey.700">
                  Unanswered Questions:
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {quiz.questions.length - Object.keys(answers).length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setConfirmSubmit(false)}
            sx={{
              color: "grey.700",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "black",
              "&:hover": { bgcolor: "grey.900" },
              px: 3,
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
