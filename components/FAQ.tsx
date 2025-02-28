import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Sparkles,
  Settings,
  FileText,
  Clock,
  Brain,
} from "lucide-react";

const FAQItem = ({
  faq,
  isOpen,
  onToggle,
  index,
}: {
  faq: { question: string; answer: string; icon: React.FC<any> };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1 }}
    className="mb-4"
  >
    <div
      className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 hover:from-gray-800 hover:to-gray-700 transition-all duration-300 cursor-pointer border border-gray-700 hover:border-gray-600"
      onClick={onToggle}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          {faq.icon && <faq.icon className="w-5 h-5 text-indigo-400" />}
          <h3 className="text-xl font-semibold text-gray-100">
            {faq.question}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-400 mt-4 leading-relaxed">{faq.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

export default function EnhancedFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "How does the AI quiz generation work?",
      answer:
        "Our platform leverages multiple advanced AI models (including Claude, GPT-4, and Gemini) to analyze your content and generate high-quality questions. The AI understands context, identifies key concepts, and creates diverse question types while ensuring accuracy and relevance.",
      icon: Brain,
    },
    {
      question: "Can I customize the generated quizzes?",
      answer:
        "Absolutely! Our platform offers comprehensive customization options. You can select question types (MCQ, True/False, Fill in the blanks), adjust difficulty levels, set time limits, and even fine-tune individual questions. Premium users get access to advanced customization features and AI models.",
      icon: Settings,
    },
    {
      question: "What file formats are supported for upload?",
      answer:
        "Currently, we support PDF documents with high-quality text extraction. Our system can handle complex formats including mathematical equations and diagrams. We're actively working on adding support for more formats including Word documents and PowerPoint presentations.",
      icon: FileText,
    },
    {
      question: "How long does quiz generation take?",
      answer:
        "Quiz generation typically takes 30-60 seconds, depending on content length and complexity. Our AI processes your content rapidly while ensuring high-quality question generation. Premium users get priority processing for even faster results.",
      icon: Clock,
    },
    {
      question: "What makes your platform unique?",
      answer:
        "Our platform stands out through its multi-AI approach, combining different models for optimal results. We offer advanced features like math equation support, intelligent topic extraction, and customizable question formats. Plus, our intuitive interface makes quiz creation effortless.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400">
          Everything you need to know about our AI-powered quiz platform
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
