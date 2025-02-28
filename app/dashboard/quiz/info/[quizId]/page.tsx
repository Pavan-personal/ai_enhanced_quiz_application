"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
}

interface Attempt {
  attemptId: string;
  user: User;
  score: number;
  totalMarks: number;
  startedAt: string;
  submittedAt: string | null;
  completed: boolean;
}

interface QuizAttemptsData {
  quizTitle: string;
  totalAttempts: number;
  attempts: Attempt[];
}

export default function QuizAttemptsPage() {
  const params = useParams();
  const quizId = params?.quizId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QuizAttemptsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quiz/created/${quizId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch quiz attempts");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchData();
    }
  }, [quizId]);

  // Date formatter function that will be consistent between server and client
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";

    try {
      const date = new Date(dateString);
      // Use a more consistent date format method
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } catch (e) {
      return dateString; // Fallback if parsing fails
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">
          <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">
            {data.quizTitle}
          </h1>
          <p className="text-gray-600">{data.totalAttempts} Total Attempts</p>
          <div className="h-px bg-gray-200 w-full mt-4"></div>
        </header>

        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Started
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.attempts?.map((attempt) => (
                <tr key={attempt.attemptId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {attempt.user.image ? (
                          <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
                            <Image
                              src={attempt.user.image}
                              alt={attempt.user.name || "User"}
                              layout="fill"
                              objectFit="cover"
                            />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm font-medium">
                              {attempt.user.name?.charAt(0) || "U"}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {attempt.user.name || "Unnamed User"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {attempt.user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {attempt.score} / {attempt.totalMarks}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((attempt.score / attempt.totalMarks) * 100)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(attempt.startedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attempt.submittedAt
                      ? formatDate(attempt.submittedAt)
                      : "—"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {attempt.completed ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        In Progress
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.attempts.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No attempts yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No one has attempted this quiz yet.
            </p>
          </div>
        )}
      </div>
    </div>
    // <div className="text-5xl text-white">{JSON.stringify(data)}</div>
  );
}
