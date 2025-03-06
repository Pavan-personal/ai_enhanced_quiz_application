"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Crown,
  Share2,
  Sparkles,
  Zap,
  Lock,
  ChevronRight,
  History,
  LogOut,
  Plus,
  Settings,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  Alert,
  Snackbar,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import { SidebarBody, Sidebar, SidebarLink } from "@/components/sidebar";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { SessionObject } from "@/types";

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
  createdAt: string;
  totalMarks: number;
  startedAt: string;
}

const SkeletonCard = () => (
  <Card className="w-full">
    <CardContent className="animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-100 rounded w-1/2"></div>
        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
      </div>
    </CardContent>
  </Card>
);

const QuizCard = ({
  quiz,
  type,
}: {
  quiz: Quiz | QuizAttempt;
  type: "created" | "attempted";
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const copyQuizLink = async (id: string) => {
    const link = `${window.location.origin}/quiz/${id}`;
    await navigator.clipboard.writeText(link);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Card
        onClick={() => {
          if (type === "created") {
            window.location.href = `/dashboard/quiz/info/${(quiz as Quiz).id}`;
          }
        }}
        className={
          (type === "created" ? "cursor-pointer" : "") +
          " w-full transition-shadow duration-200 hover:shadow-lg"
        }
      >
        <CardContent>
          <div className="flex justify-between items-start mb-4">
            <div>
              <Typography variant="h6" className="font-bold w-72">
                {type === "created"
                  ? (quiz as Quiz).title
                  : (quiz as QuizAttempt).quiz.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {type === "created"
                  ? `${(quiz as Quiz).attempts} attempts`
                  : `Score: ${(quiz as QuizAttempt).score}/${
                      (quiz as QuizAttempt).totalMarks
                    }`}
              </Typography>
            </div>
            {type === "created" && (
              <Button
                variant="outlined"
                className="min-w-0 p-2 hover:bg-black hover:text-white"
                onClick={(e) => {
                  e.preventDefault();
                  copyQuizLink(quiz.id);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <Typography variant="body2">
              {new Date(
                type === "created"
                  ? (quiz as QuizAttempt).createdAt
                  : (quiz as QuizAttempt).startedAt
              ).toLocaleDateString()}
            </Typography>
          </div>
        </CardContent>
      </Card>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Quiz link copied to clipboard!"
      />
    </>
  );
};

const UpgradeBanner = () => (
  <Card className="bg-black text-white mt-8">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Crown className="h-6 w-6 text-yellow-400" />
          <Typography variant="h5" component="h2" className="text-white">
            Upgrade to Pro
          </Typography>
        </div>
        <Button
          variant="contained"
          className="bg-white text-black hover:bg-gray-100 normal-case"
        >
          Upgrade Now
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 w-fit gap-2">
        <div className="flex items-center w-full justify-center gap-2">
          <Sparkles className="h-5 w-5" />
          <Typography variant="body1" className="text-white">
            AI-Powered Quiz Generation
          </Typography>
        </div>
        <div className="flex items-center justify-center w-full gap-2">
          <Zap className="h-5 w-5" />
          <Typography variant="body1" className="text-white">
            Unlimited Quizzes
          </Typography>
        </div>
        <div className="flex items-center w-ull justify-center gap-2">
          <Lock className="h-5 w-5" />
          <Typography variant="body1" className="text-white">
            Advanced Analytics
          </Typography>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [tabValue, setTabValue] = useState(0);
  const [createdQuizzes, setCreatedQuizzes] = useState<{
    is_loaded: boolean;
    quiz: Quiz[];
  }>({
    is_loaded: false,
    quiz: [],
  });

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

  const [attemptedQuizzes, setAttemptedQuizzes] = useState<{
    is_loaded: boolean;
    quiz: QuizAttempt[];
  }>({
    is_loaded: false,
    quiz: [],
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [SignOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const sidebarLinks = [
    {
      label: "Start a new chat",
      href: "/",
      icon: <Plus className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />,
      onclick: () => {},
    },
    {
      label: "Settings",
      href: "/dashboard",
      icon: (
        <Settings className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const chatHistory = [
    { id: 1, title: "Math Quiz Generation", date: "2024-12-25" },
    { id: 2, title: "Science Topics", date: "2024-12-24" },
    { id: 3, title: "History Questions", date: "2024-12-23" },
  ];

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
        setAttemptedQuizzes({
          is_loaded: true,
          quiz: attempted,
        });
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="flex flex-col justify-between h-full">
          <div className="space-y-8">
            <div className="space-y-2">
              {sidebarLinks.map((link) => (
                <SidebarLink key={link.label} link={link} />
              ))}
            </div>

            <div className="space-y-4">
              <motion.div
                animate={{
                  opacity: sidebarOpen ? 1 : 0,
                }}
                className="text-sm font-medium text-neutral-500"
              >
                Recently created
              </motion.div>
              <div className="space-y-2">
                {chatHistory.slice(0, 5).map((chat) => (
                  <SidebarLink
                    key={chat.id}
                    link={{
                      label: chat.title,
                      href: `/chat/${chat.id}`,
                      icon: (
                        <ChevronRight className="w-4 h-4 text-neutral-500" />
                      ),
                    }}
                    className="text-sm"
                  />
                ))}
                <SidebarLink
                  link={{
                    label: "View All",
                    href: "/",
                    icon: <History className="w-4 h-4 text-neutral-500" />,
                  }}
                  className="text-sm text-neutral-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              {data?.image ? (
                <img
                  src={data.image}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <img
                  src={"https://cdn-icons-png.flaticon.com/512/666/666201.png"}
                  alt="user"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <motion.div
                animate={{
                  opacity: sidebarOpen ? 1 : 0,
                }}
                className="flex flex-col"
              >
                <span className="text-sm text-slate-300 font-medium">
                  {data?.name}
                </span>
                <span className="text-xs text-neutral-500">{data?.email}</span>
              </motion.div>
            </div>
            <div className="w-fit">
              <SidebarLink
                link={{
                  label: "Sign Out",
                  href: "/",
                  icon: (
                    <LogOut
                      onClick={() => {
                        // signOut();
                        setSignOutDialogOpen(true);
                      }}
                      className="w-8 h-8 text-neutral-500"
                    />
                  ),
                }}
                className="mt-2 text-sm text-red-500"
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="p-16 w-fit mx-auto bg-gray-50">
        <div className="flex items-center justify-between">
          <Typography variant="h4" component="h1" className="font-bold">
            Your Quizzes
          </Typography>
          <Link href="/">
            <Button
              variant="contained"
              className="bg-black hover:bg-gray-800 normal-case"
            >
              Create New Quiz
            </Button>
          </Link>
        </div>

        <div>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            className="mb-6"
          >
            <Tab label="Created" />
            <Tab label="Attempted" />
          </Tabs>

          <div className="mt-4">
            {tabValue === 0 &&
              (!createdQuizzes.is_loaded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : createdQuizzes.quiz.length === 0 ? (
                <Alert severity="info">
                  You haven't created any quizzes yet. Start by creating your
                  first quiz!
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {createdQuizzes.quiz.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} type="created" />
                  ))}
                </div>
              ))}

            {tabValue === 1 &&
              (!attemptedQuizzes.is_loaded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : attemptedQuizzes.quiz.length === 0 ? (
                <Alert severity="info">
                  You haven't attempted any quizzes yet. Find a quiz to get
                  started!
                </Alert>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attemptedQuizzes.quiz.map((quiz) => (
                    <QuizCard key={quiz.id} quiz={quiz} type="attempted" />
                  ))}
                </div>
              ))}
          </div>
        </div>

        <UpgradeBanner />
      </div>
    </div>
  );
}
