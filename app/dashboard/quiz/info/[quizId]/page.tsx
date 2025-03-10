// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Image from "next/image";

// interface User {
//   id: string;
//   name: string | null;
//   email: string | null;
//   image: string | null;
// }

// interface Attempt {
//   attemptId: string;
//   user: User;
//   score: number;
//   totalMarks: number;
//   startedAt: string;
//   submittedAt: string | null;
//   completed: boolean;
// }

// interface QuizAttemptsData {
//   quizTitle: string;
//   totalAttempts: number;
//   attempts: Attempt[];
// }

// export default function QuizAttemptsPage() {
//   const params = useParams();
//   const quizId = params?.quizId as string;
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [data, setData] = useState<QuizAttemptsData | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/api/quiz/created/${quizId}`);

//         if (!response.ok) {
//           throw new Error("Failed to fetch quiz attempts");
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(
//           err instanceof Error ? err.message : "An unknown error occurred"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (quizId) {
//       fetchData();
//     }
//   }, [quizId]);

//   // Date formatter function that will be consistent between server and client
//   const formatDate = (dateString: string) => {
//     if (!dateString) return "—";

//     try {
//       const date = new Date(dateString);
//       // Use a more consistent date format method
//       return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       })}`;
//     } catch (e) {
//       return dateString; // Fallback if parsing fails
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="animate-pulse">
//           <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24">
//             <circle
//               className="opacity-25"
//               cx="12"
//               cy="12"
//               r="10"
//               stroke="currentColor"
//               strokeWidth="4"
//             ></circle>
//             <path
//               className="opacity-75"
//               fill="currentColor"
//               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//             ></path>
//           </svg>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="max-w-md text-center">
//           <h2 className="text-2xl font-bold mb-4">Error</h2>
//           <p className="text-gray-700">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-6 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <p>No data available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <header className="mb-10">
//           <h1 className="text-3xl font-bold text-black mb-2">
//             {data.quizTitle}
//           </h1>
//           <p className="text-gray-600">{data.totalAttempts} Total Attempts</p>
//           <div className="h-px bg-gray-200 w-full mt-4"></div>
//         </header>

//         <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Student
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Score
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Started
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Submitted
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {data?.attempts?.map((attempt) => (
//                 <tr key={attempt.attemptId} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="flex-shrink-0 h-10 w-10 relative">
//                         {attempt.user.image ? (
//                           <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden relative">
//                             <Image
//                               src={attempt.user.image}
//                               alt={attempt.user.name || "User"}
//                               layout="fill"
//                               objectFit="cover"
//                             />
//                           </div>
//                         ) : (
//                           <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                             <span className="text-gray-500 text-sm font-medium">
//                               {attempt.user.name?.charAt(0) || "U"}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">
//                           {attempt.user.name || "Unnamed User"}
//                         </div>
//                         <div className="text-sm text-gray-500">
//                           {attempt.user.email}
//                         </div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900 font-medium">
//                       {attempt.score} / {attempt.totalMarks}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {Math.round((attempt.score / attempt.totalMarks) * 100)}%
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {formatDate(attempt.startedAt)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {attempt.submittedAt
//                       ? formatDate(attempt.submittedAt)
//                       : "—"}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {attempt.completed ? (
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                         Completed
//                       </span>
//                     ) : (
//                       <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
//                         In Progress
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {data.attempts.length === 0 && (
//           <div className="text-center py-16">
//             <svg
//               className="mx-auto h-12 w-12 text-gray-400"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//               />
//             </svg>
//             <h3 className="mt-2 text-sm font-medium text-gray-900">
//               No attempts yet
//             </h3>
//             <p className="mt-1 text-sm text-gray-500">
//               No one has attempted this quiz yet.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

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
  timeSpent?: number; // in minutes
}

interface QuizAttemptsData {
  quizTitle: string;
  totalAttempts: number;
  attempts: Attempt[];
}

// Grade distribution ranges
const gradeRanges = [
  { min: 0, max: 59, label: 'F' },
  { min: 60, max: 69, label: 'D' },
  { min: 70, max: 79, label: 'C' },
  { min: 80, max: 89, label: 'B' },
  { min: 90, max: 100, label: 'A' }
];

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function QuizAnalyticsDashboard() {
  const params = useParams();
  const quizId = params?.quizId as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<QuizAttemptsData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending';
  }>({ key: "score", direction: "descending" });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("table");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quiz/created/${quizId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch quiz attempts");
        }

        const result = await response.json();
        
        // Calculate time spent for each attempt
        result.attempts = result.attempts.map((attempt: Attempt) => {
          if (attempt.submittedAt && attempt.startedAt) {
            const start = new Date(attempt.startedAt).getTime();
            const end = new Date(attempt.submittedAt).getTime();
            const timeSpentMin = Math.round((end - start) / (1000 * 60));
            return { ...attempt, timeSpent: timeSpentMin };
          }
          return attempt;
        });
        
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

  // Format date consistently
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";

    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } catch (e) {
      return dateString;
    }
  };

  // Calculate grade distribution
  const gradeDistribution = useMemo(() => {
    if (!data?.attempts?.length) return [];
    
    const distribution = gradeRanges.map(range => ({
      name: range.label,
      count: 0,
      range: `${range.min}-${range.max}%`
    }));
    
    data.attempts.forEach(attempt => {
      if (attempt.completed) {
        const percentage = Math.round((attempt.score / attempt.totalMarks) * 100);
        const gradeIndex = gradeRanges.findIndex(
          range => percentage >= range.min && percentage <= range.max
        );
        if (gradeIndex !== -1) {
          distribution[gradeIndex].count++;
        }
      }
    });
    
    return distribution;
  }, [data]);

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (!data?.attempts?.length) return { 
      avgScore: 0, 
      highestScore: 0, 
      lowestScore: 0, 
      medianScore: 0,
      avgTimeSpent: 0,
      completionRate: 0
    };
    
    const completedAttempts = data.attempts.filter(a => a.completed);
    if (!completedAttempts.length) return { 
      avgScore: 0, 
      highestScore: 0, 
      lowestScore: 0, 
      medianScore: 0,
      avgTimeSpent: 0,
      completionRate: 0 
    };
    
    const scores = completedAttempts.map(a => (a.score / a.totalMarks) * 100);
    const sortedScores = [...scores].sort((a, b) => a - b);
    
    // Calculate time metrics only for completed attempts with timeSpent property
    const attemptsWithTime = completedAttempts.filter(a => a.timeSpent !== undefined);
    const avgTimeSpent = attemptsWithTime.length ? 
      attemptsWithTime.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / attemptsWithTime.length : 
      0;
    
    return {
      avgScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      highestScore: Math.max(...scores),
      lowestScore: Math.min(...scores),
      medianScore: sortedScores.length % 2 === 0 
        ? (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2 
        : sortedScores[Math.floor(sortedScores.length / 2)],
      avgTimeSpent,
      completionRate: (completedAttempts.length / data.attempts.length) * 100
    };
  }, [data]);

  // Top performers
  const topPerformers = useMemo(() => {
    if (!data?.attempts?.length) return [];
    
    const completedAttempts = data.attempts.filter(a => a.completed);
    return [...completedAttempts]
      .sort((a, b) => (b.score / b.totalMarks) - (a.score / a.totalMarks))
      .slice(0, 5);
  }, [data]);

  // Sort the attempts
  const requestSort = (key: string) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort attempts
  const filteredAndSortedAttempts = useMemo(() => {
    if (!data?.attempts) return [];
    
    // Filter by status and search term
    let filtered = [...data.attempts];
    
    if (filterStatus !== "all") {
      filtered = filtered.filter(attempt => 
        filterStatus === "completed" ? attempt.completed : !attempt.completed
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(attempt => 
        (attempt.user.name?.toLowerCase().includes(term) ||
        attempt.user.email?.toLowerCase().includes(term))
      );
    }
    
    // Sort the data
    return filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortConfig.key) {
        case "name":
          aVal = a.user.name || "";
          bVal = b.user.name || "";
          break;
        case "score":
          aVal = a.score / a.totalMarks;
          bVal = b.score / b.totalMarks;
          break;
        case "startedAt":
          aVal = new Date(a.startedAt).getTime();
          bVal = new Date(b.startedAt).getTime();
          break;
        case "submittedAt":
          aVal = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          bVal = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          break;
        case "timeSpent":
          aVal = a.timeSpent || 0;
          bVal = b.timeSpent || 0;
          break;
        default:
          aVal = a.score;
          bVal = b.score;
      }
      
      if (sortConfig.direction === 'ascending') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [data, searchTerm, sortConfig, filterStatus]);

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
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-black mb-1">
                {data.quizTitle}
              </h1>
              <p className="text-gray-600">{data.totalAttempts} Total Attempts</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => window.print()} 
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
              >
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Report
              </button>
              <button 
                onClick={() => alert('Export functionality would go here')} 
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-white hover:bg-gray-50"
              >
                <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </button>
            </div>
          </div>
          
          <div className="flex border-b border-gray-200">
            <button
              className={`py-3 px-6 ${activeTab === 'table' ? 'border-b-2 border-black font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('table')}
            >
              Data Table
            </button>
            <button
              className={`py-3 px-6 ${activeTab === 'analytics' ? 'border-b-2 border-black font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
            <button
              className={`py-3 px-6 ${activeTab === 'insights' ? 'border-b-2 border-black font-medium' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('insights')}
            >
              Insights
            </button>
          </div>
        </header>

        {/* Analytics Dashboard */}
        {activeTab === 'analytics' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Average Score</h3>
                <p className="text-3xl font-bold">{performanceMetrics.avgScore.toFixed(1)}%</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Completion Rate</h3>
                <p className="text-3xl font-bold">{performanceMetrics.completionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Highest Score</h3>
                <p className="text-3xl font-bold">{performanceMetrics.highestScore.toFixed(1)}%</p>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-1">Avg Time Spent</h3>
                <p className="text-3xl font-bold">{performanceMetrics.avgTimeSpent.toFixed(1)} min</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Grade Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name, props) => [`${value} students`, 'Count']}
                        labelFormatter={(label) => `Grade ${label}`}
                      />
                      <Legend />
                      <Bar dataKey="count" name="Students" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Completion Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Completed', value: data.attempts.filter(a => a.completed).length },
                          { name: 'In Progress', value: data.attempts.filter(a => !a.completed).length }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? '#000000' : '#CCCCCC'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} attempts`, 'Count']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Top Performers</h3>
                {topPerformers.length > 0 ? (
                  <div className="space-y-4">
                    {topPerformers.map((performer, idx) => (
                      <div key={performer.attemptId} className="flex items-center">
                        <div className="w-8 h-8 flex-shrink-0 mr-2 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium truncate">
                              {performer.user.name || 'Unnamed User'}
                            </p>
                            <p className="ml-2 text-sm font-bold">
                              {Math.round((performer.score / performer.totalMarks) * 100)}%
                            </p>
                          </div>
                          <div className="w-full bg-gray-200 rounded h-1.5 mt-1">
                            <div 
                              className="bg-black h-1.5 rounded" 
                              style={{ width: `${(performer.score / performer.totalMarks) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No completed attempts yet</p>
                )}
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Key Insights</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-black">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      {performanceMetrics.completionRate > 80 ? 'High completion rate indicates good quiz engagement' : 'Low completion rate may indicate the quiz is too difficult or time-consuming'}
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-black">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      {performanceMetrics.avgScore > 80 ? 'High average score suggests the quiz may be too easy' : performanceMetrics.avgScore < 60 ? 'Low average score suggests the quiz may be too difficult' : 'The quiz difficulty level appears balanced'}
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-black">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      The average time spent on the quiz is {performanceMetrics.avgTimeSpent.toFixed(1)} minutes, {performanceMetrics.avgTimeSpent > 20 ? 'which may be longer than ideal' : 'which is reasonable'}
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="text-black">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="ml-2 text-sm text-gray-600">
                      The gap between highest ({performanceMetrics.highestScore.toFixed(1)}%) and lowest ({performanceMetrics.lowestScore.toFixed(1)}%) scores is {(performanceMetrics.highestScore - performanceMetrics.lowestScore).toFixed(1)}%, indicating {(performanceMetrics.highestScore - performanceMetrics.lowestScore) > 40 ? 'a wide range of student comprehension' : 'consistent understanding across students'}
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {activeTab === 'table' && (
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                >
                  <option value="all">All Attempts</option>
                  <option value="completed">Completed</option>
                  <option value="inProgress">In Progress</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("name")}
                    >
                      <div className="flex items-center">
                        <span>Student</span>
                        <span className="ml-2 text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === "name" ? (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          ) : "↕"}
                        </span>
                      </div>
                    </th>
                    <th 
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("score")}
                    >
                      <div className="flex items-center">
                        <span>Score</span>
                        <span className="ml-2 text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === "score" ? (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          ) : "↕"}
                        </span>
                      </div>
                    </th>
                    <th 
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("startedAt")}
                    >
                      <div className="flex items-center">
                        <span>Started</span>
                        <span className="ml-2 text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === "startedAt" ? (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          ) : "↕"}
                        </span>
                      </div>
                    </th>
                    <th 
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("submittedAt")}
                    >
                      <div className="flex items-center">
                        <span>Submitted</span>
                        <span className="ml-2 text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === "submittedAt" ? (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          ) : "↕"}
                        </span>
                      </div>
                    </th>
                    <th 
                      className="group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => requestSort("timeSpent")}
                    >
                      <div className="flex items-center">
                        <span>Time Spent</span>
                        <span className="ml-2 text-gray-400 group-hover:text-gray-500">
                          {sortConfig.key === "timeSpent" ? (
                            sortConfig.direction === "ascending" ? "↑" : "↓"
                          ) : "↕"}
                        </span>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedAttempts.map((attempt) => (
                    <tr key={attempt.attemptId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {attempt.user.image ? (
                            <Image
                              src={attempt.user.image}
                              alt={attempt.user.name || "User Image"}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-500 text-sm font-medium">
                                {attempt.user.name?.charAt(0) || "U"}
                              </span>
                            </div>
                          )}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {attempt.timeSpent ? `${attempt.timeSpent} min` : "—"}
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
          </>
        )}
      </div>
    </div>
  );
}