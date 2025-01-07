"use client";

import React, { useEffect, useState } from "react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Trophy, Plus, Crown, Box } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  attempts: number;
}

interface QuizAttempt {
  id: string;
  quiz: {
    title: string;
  };
  score: number;
  submittedAt: string;
}

export default function DashboardPage() {
  const [createdQuizzes, setCreatedQuizzes] = useState<{
    is_loaded: Boolean;
    quiz: Quiz[];
  }>({
    is_loaded: false,
    quiz: [],
  });
  const [attemptedQuizzes, setAttemptedQuizzes] = useState<{
    is_loaded: Boolean;
    quiz: QuizAttempt[];
  }>({
    is_loaded: false,
    quiz: [],
  });
  const [value, setValue] = useState("created");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const [createdRes, attemptedRes] = await Promise.all([
          fetch("/api/quiz/created"),
          fetch("/api/quiz/attempted"),
        ]);

        const created = await createdRes.json();
        const attempted = await attemptedRes.json();

        setCreatedQuizzes({
          is_loaded: true,
          quiz: created,
        });
        setAttemptedQuizzes({ is_loaded: true, quiz: attempted });
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {createdQuizzes?.is_loaded && (
        <div>{JSON.stringify(createdQuizzes?.quiz)}</div>
      )}
      {attemptedQuizzes?.is_loaded && (
        <div>{JSON.stringify(attemptedQuizzes?.quiz)}</div>
      )}
    </div>
  );
}
