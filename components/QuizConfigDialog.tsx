import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  CircularProgress,
  Alert,
  FormHelperText,
} from "@mui/material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { format } from "date-fns";
import { QuizPDF } from "./QuizPDF";

interface QuizConfigDialogProps {
  open: boolean;
  onClose: () => void;
  questions: any[]; // Your questions array type
  title: string;
}

export function QuizConfigDialog({
  open,
  onClose,
  questions,
  title,
}: QuizConfigDialogProps) {
  const [mode, setMode] = useState<"online" | "offline">("online");
  const [duration, setDuration] = useState("30");
  const [marksPerQuestion, setMarksPerQuestion] = useState("1");
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState({
    duration: true,
    dateTime: true,
    marks: true,
  });

  const validateForm = () => {
    const newValidation = {
      duration: parseInt(duration) > 0,
      dateTime:
        mode === "offline" || (mode === "online" && !!scheduledDateTime),
      marks: parseInt(marksPerQuestion) > 0,
    };
    setValidation(newValidation);
    return Object.values(newValidation).every((v) => v);
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    if (mode === "offline") {
      // PDF generation is handled by PDFDownloadLink
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          duration: parseInt(duration),
          scheduledFor: new Date(scheduledDateTime).toISOString(),
          marksPerQuestion: parseInt(marksPerQuestion),
          questions,
          title: title,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      onClose();
    } catch (error) {
      setError("Failed to create quiz. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "500px",
          bgcolor: "background.paper",
          borderRadius: 1,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Quiz Settings
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Quiz Mode</InputLabel>
            <Select
              value={mode}
              onChange={(e) => setMode(e.target.value as "online" | "offline")}
              label="Quiz Mode"
            >
              <MenuItem value="online">Online</MenuItem>
              <MenuItem value="offline">Offline (PDF)</MenuItem>
            </Select>
          </FormControl>

          {mode === "online" && (
            <>
              <TextField
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={!validation.duration}
                helperText={
                  !validation.duration && "Duration must be greater than 0"
                }
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />

              <TextField
                label="Quiz Date & Time"
                type="datetime-local"
                value={scheduledDateTime}
                onChange={(e) => setScheduledDateTime(e.target.value)}
                error={!validation.dateTime}
                helperText={
                  !validation.dateTime && "Please select a valid date and time"
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                label="Marks per Question"
                type="number"
                value={marksPerQuestion}
                onChange={(e) => setMarksPerQuestion(e.target.value)}
                error={!validation.marks}
                helperText={!validation.marks && "Marks must be greater than 0"}
                fullWidth
                InputProps={{ inputProps: { min: 1 } }}
              />
            </>
          )}

          {mode === "offline" ? (
            <PDFDownloadLink
              document={
                <QuizPDF
                  questions={questions}
                  marksPerQuestion={parseInt(marksPerQuestion)}
                />
              }
              fileName={`quiz-${format(new Date(), "yyyy-MM-dd")}.pdf`}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "black",
                  "&:hover": {
                    bgcolor: "grey.900",
                  },
                }}
              >
                Download PDF
              </Button>
            </PDFDownloadLink>
          ) : (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={isSubmitting}
              sx={{
                bgcolor: "black",
                "&:hover": {
                  bgcolor: "grey.900",
                },
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : (
                "Schedule Quiz"
              )}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
