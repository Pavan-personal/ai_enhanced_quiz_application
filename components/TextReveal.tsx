import { motion } from "framer-motion";
import React from "react";

interface TextRevealProps {
  text: string;
  delay?: number;
    className?: string;
}

const TextReveal: React.FC<TextRevealProps> = ({ text, delay = 0,className }) => {
  const words = text.split(" ");

  return (
    <div className={`${'flex flex-wrap ' + className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: delay + i * 0.1,
            ease: [0.33, 1, 0.68, 1],
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export default TextReveal;