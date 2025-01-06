"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  FileText,
  Book,
  Sparkles,
  History,
  ChevronRight,
  LogOut,
  Settings,
} from "lucide-react";
import "filepond/dist/filepond.min.css";
import TopicQuizGenerator from "@/components/TopicQuizGenerator";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import PDFQuizGenerator from "@/components/PdfQuizGenerator";

// Mock chat history data - replace with your API call
const chatHistory = [
  { id: 1, title: "Math Quiz Generation", date: "2024-12-25" },
  { id: 2, title: "Science Topics", date: "2024-12-24" },
  { id: 3, title: "History Questions", date: "2024-12-23" },
  // ... more items
];

const QuizGenerator = () => {
  const [mode, setMode] = useState("topic");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    {
      label: "Recent Chats",
      href: "/history",
      icon: (
        <History className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="flex flex-col justify-between h-full">
          <div className="space-y-8 ">
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
                Recent Chats
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
                    href: "/history",
                    icon: <History className="w-4 h-4 text-neutral-500" />,
                  }}
                  className="text-sm text-neutral-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={"https://cdn-icons-png.flaticon.com/512/666/666201.png"}
                  style={{
                    filter: "invert(1)",
                    background: "red",
                    padding: "0.25rem",
                  }}
                />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <motion.div
                animate={{
                  opacity: sidebarOpen ? 1 : 0,
                }}
                className="flex flex-col"
              >
                <span className="text-sm font-medium">User Name</span>
                <span className="text-xs text-neutral-500">
                  user@example.com
                </span>
              </motion.div>
            </div>
            <SidebarLink
              link={{
                label: "Sign Out",
                href: "/logout",
                icon: <LogOut className="w-4 h-4 text-neutral-500" />,
              }}
              className="mt-2 text-sm text-red-500"
            />
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-3xl mx-auto p-8 space-y-12"
        >
          <motion.div
            className="flex items-center justify-center space-x-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Bot className="w-8 h-8 text-black" />
            <h1 className="text-4xl font-bold text-black tracking-tight">
              MindMesh AI
            </h1>
            <Sparkles className="w-6 h-6 text-black" />
          </motion.div>

          <div className="flex justify-center space-x-6">
            {["topic", "pdf"].map((buttonMode) => (
              <motion.button
                key={buttonMode}
                onClick={() => setMode(buttonMode)}
                className={`relative px-6 py-3 rounded-xl border ${
                  mode === buttonMode
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200 hover:border-black"
                } transition-colors duration-200`}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-2">
                  {buttonMode === "pdf" ? (
                    <FileText className="w-5 h-5" />
                  ) : (
                    <Book className="w-5 h-5" />
                  )}
                  <span className="capitalize">{buttonMode} Based</span>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div className="bg-white rounded-2xl shadow-lg p-8" layout>
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {mode === "topic" ? (
                  <TopicQuizGenerator key="topic" />
                ) : (
                  <PDFQuizGenerator key="pdf" />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </div>

    </div>
  );
};

export default QuizGenerator;
