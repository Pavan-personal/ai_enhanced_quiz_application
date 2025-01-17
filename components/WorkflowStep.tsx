import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Clock, Upload, Settings } from 'lucide-react';

const WorkflowStep = ({ Icon, title, description, gradient, delay, lineColor }: {
    // Icon: any;
    Icon: React.FC<any>;
    title: string;
    description: string;
    gradient: string;
    delay: number;
    lineColor?: string;
}) => (
  <motion.div
    className="flex items-start gap-4 relative"
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5 }}
  >
    <div className="relative">
      <motion.div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${gradient} shadow-xl`}
        whileHover={{ scale: 1.1 }}
      >
        <Icon className="w-6 h-6 text-white" />
      </motion.div>
      {lineColor && (
        <div className={`absolute left-1/2 top-12 w-0.5 h-16 ${lineColor} -translate-x-1/2`} />
      )}
    </div>
    <div className="flex-1 pb-16">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

export default function WorkflowComponent() {
  const steps = [
    {
      Icon: Upload,
      title: "Upload or Choose Topics",
      description: "Start by uploading your study material (PDF) or selecting specific topics for quiz generation.",
      gradient: "bg-gradient-to-r from-purple-600 to-indigo-600",
      lineColor: "bg-gradient-to-b from-purple-600 to-transparent"
    },
    {
      Icon: Brain,
      title: "AI-Powered Analysis",
      description: "Our advanced AI models (Claude, GPT-4, Gemini) analyze your content to understand context and key concepts.",
      gradient: "bg-gradient-to-r from-blue-600 to-cyan-600",
      lineColor: "bg-gradient-to-b from-blue-600 to-transparent"
    },
    {
      Icon: Sparkles,
      title: "Smart Question Generation",
      description: "Questions are intelligently crafted across different formats: MCQs, True/False, and more.",
      gradient: "bg-gradient-to-r from-emerald-600 to-teal-600",
      lineColor: "bg-gradient-to-b from-emerald-600 to-transparent"
    },
    {
      Icon: Settings,
      title: "Customization",
      description: "Fine-tune difficulty levels, question types, and add custom requirements for perfect alignment.",
      gradient: "bg-gradient-to-r from-orange-600 to-yellow-600",
      lineColor: "bg-gradient-to-b from-orange-600 to-transparent"
    },
    {
      Icon: Clock,
      title: "Schedule & Share",
      description: "Set quiz timing, duration, and share with participants seamlessly.",
      gradient: "bg-gradient-to-r from-pink-600 to-rose-600"
    }
  ];

  return (
    <motion.div 
      className="max-w-4xl mx-auto p-8 rounded-3xl bg-gray-900/50 backdrop-blur-xl border mb-20 border-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          How It Works
        </motion.h2>
        <motion.p 
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Transform your content into engaging quizzes with our AI-powered platform
        </motion.p>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <WorkflowStep
            key={index}
            {...step}
            delay={0.4 + index * 0.1}
          />
        ))}
      </div>
    </motion.div>
  );
}