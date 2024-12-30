// // types.ts
// interface QuizQuestion {
//   type: string;
//   question: string;
//   answer: number;
//   options: string[];
// }

// // QuizPDFButton.tsx
// import React from "react";
// import {
//   PDFDownloadLink,
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   PDFViewer,
// } from "@react-pdf/renderer";
// import { FileDown, Loader2 } from "lucide-react";
// import { Button } from "@mui/material";
// import { motion, AnimatePresence } from "framer-motion";

// // Define PDF styles
// const styles = StyleSheet.create({
//   page: {
//     padding: 40,
//     fontSize: 12,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   questionContainer: {
//     marginBottom: 20,
//   },
//   question: {
//     marginBottom: 10,
//     fontSize: 14,
//   },
//   option: {
//     marginLeft: 20,
//     marginBottom: 5,
//   },
//   answer: {
//     marginTop: 10,
//     color: "green",
//   },
// });

// interface QuizPDFProps {
//   questions: QuizQuestion[];
// }

// // PDF Document Component with proper types
// const QuizPDF: React.FC<QuizPDFProps> = ({ questions }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.title}>Quiz Questions</Text>
//       {questions.map((q, idx) => (
//         <View key={idx} style={styles.questionContainer}>
//           <Text style={styles.question}>
//             {idx + 1}. {q.question}
//           </Text>
//           {q.options.map((option, optIdx) => (
//             <Text key={optIdx} style={styles.option}>
//               {String.fromCharCode(65 + optIdx)}. {option}
//             </Text>
//           ))}
//           <Text style={styles.answer}>
//             Correct Answer: {String.fromCharCode(65 + parseInt(q.answer.toString()))}
//           </Text>
//         </View>
//       ))}
//     </Page>
//   </Document>
// );

// const QuizPDFButton: React.FC<QuizPDFProps> = ({ questions }) => {
//   return (
//     <PDFDownloadLink
//       document={<QuizPDF questions={questions} />}
//       fileName="quiz-questions.pdf"
//     >
//       <motion.button
//         className="w-full py-4 bg-black text-white rounded-xl flex items-center justify-center space-x-2"
//         whileHover={{ scale: 1.02 }}
//         whileTap={{ scale: 0.98 }}
//       >
//         Download Questions
//       </motion.button>
//     </PDFDownloadLink>
//   );
// };

// export default QuizPDFButton;

// types.ts
interface QuizQuestion {
  type: string;
  question: string;
  answer: number;
  options: string[];
}

// QuizPDFButton.tsx
import React from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { FileDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Function to parse and format text with sub/sup tags
const formatText = (text: string) => {
  // Split the text into segments based on sub and sup tags
  const segments = [];
  let currentIndex = 0;
  let textContent = text;

  // Handle sub tags
  while (textContent.includes("<sub>")) {
    const startIndex = textContent.indexOf("<sub>");
    const endIndex = textContent.indexOf("</sub>");

    if (startIndex > currentIndex) {
      segments.push({
        text: textContent.slice(currentIndex, startIndex),
        type: "normal",
      });
    }

    segments.push({
      text: textContent.slice(startIndex + 5, endIndex),
      type: "subscript",
    });

    textContent = textContent.slice(endIndex + 6);
    currentIndex = 0;
  }

  // Handle remaining text
  if (textContent) {
    segments.push({
      text: textContent,
      type: "normal",
    });
  }

  return segments;
};

// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    marginBottom: 10,
    fontSize: 14,
  },
  option: {
    marginLeft: 20,
    marginBottom: 5,
  },
  answer: {
    marginTop: 10,
    color: "green",
  },
  subscript: {
    fontSize: 8,
    verticalAlign: "sub",
  },
  superscript: {
    fontSize: 8,
    verticalAlign: "super",
  },
});

interface QuizPDFProps {
  questions: QuizQuestion[];
}

// Custom Text component that handles formatted text
const FormattedText: React.FC<{ content: string; style?: any }> = ({
  content,
  style,
}) => {
  const segments = formatText(content);

  return (
    <Text style={style}>
      {segments.map((segment, index) => (
        <Text
          key={index}
          style={
            segment.type === "subscript"
              ? styles.subscript
              : segment.type === "superscript"
              ? styles.superscript
              : undefined
          }
        >
          {segment.text}
        </Text>
      ))}
    </Text>
  );
};

// PDF Document Component with proper types
const QuizPDF: React.FC<QuizPDFProps> = ({ questions }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Quiz Questions</Text>
      {questions.map((q, idx) => (
        <View key={idx} style={styles.questionContainer}>
          <FormattedText
            content={idx + 1 + ". " + q.question}
            style={styles.question}
          />
          {q.options.map((option, optIdx) => (
            <FormattedText
              key={optIdx}
              content={`${String.fromCharCode(65 + optIdx)}. ${option}`}
              style={styles.option}
            />
          ))}
          <Text style={styles.answer}>
            Correct Answer:{" "}
            {String.fromCharCode(65 + parseInt(q.answer.toString()))}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

const QuizPDFButton: React.FC<QuizPDFProps> = ({ questions }) => {
  return (
    <PDFDownloadLink
      document={<QuizPDF questions={questions} />}
      fileName="quiz-questions.pdf"
    >
      <motion.button
        className="w-full py-4 bg-black text-white rounded-xl flex items-center justify-center space-x-2"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <FileDown className="w-5 h-5 mr-2" />
        Download Questions
      </motion.button>
    </PDFDownloadLink>
  );
};

export default QuizPDFButton;
