"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StreamingTextProps {
  text: string;
  speed?: number; // caracteres por segundo
  className?: string;
  onComplete?: () => void;
  showCursor?: boolean;
  skipAnimation?: boolean;
}

export default function StreamingText({
  text,
  speed = 50,
  className,
  onComplete,
  showCursor = true,
  skipAnimation = false,
}: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    if (skipAnimation) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    indexRef.current = 0;
    setDisplayedText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayedText(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete, skipAnimation]);

  return (
    <div className={cn("relative", className)}>
      <span className="whitespace-pre-wrap">{displayedText}</span>
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-4 bg-cyan-400 ml-1"
        />
      )}
    </div>
  );
}

interface StreamingMarkdownProps {
  markdown: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function StreamingMarkdown({
  markdown,
  speed = 50,
  className,
  onComplete,
}: StreamingMarkdownProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayedText("");
    setIsComplete(false);

    const interval = setInterval(() => {
      if (indexRef.current < markdown.length) {
        setDisplayedText(markdown.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, 1000 / speed);

    return () => clearInterval(interval);
  }, [markdown, speed, onComplete]);

  // Renderizar markdown básico
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-semibold text-white mt-4 mb-2">
            {line.replace("### ", "")}
          </h3>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-bold text-white mt-4 mb-2">
            {line.replace("## ", "")}
          </h2>
        );
      }
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold text-white mt-4 mb-3">
            {line.replace("# ", "")}
          </h1>
        );
      }

      // Lista
      if (line.startsWith("- ") || line.startsWith("* ")) {
        return (
          <li key={index} className="text-gray-300 ml-4">
            • {line.replace(/^[-*] /, "")}
          </li>
        );
      }

      // Parágrafo vazio
      if (line.trim() === "") {
        return <div key={index} className="h-2" />;
      }

      // Parágrafo normal
      return (
        <p key={index} className="text-gray-300 mb-2">
          {line}
        </p>
      );
    });
  };

  return (
    <div className={cn("space-y-1", className)}>
      {renderMarkdown(displayedText)}
      {!isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-4 bg-cyan-400 ml-1"
        />
      )}
    </div>
  );
}

interface TypewriterProps {
  words: string[];
  loop?: boolean;
  delayBetweenWords?: number;
  className?: string;
}

export function Typewriter({
  words,
  loop = true,
  delayBetweenWords = 2000,
  className,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedText.length < currentWord.length) {
            setDisplayedText(currentWord.slice(0, displayedText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), delayBetweenWords);
          }
        } else {
          if (displayedText.length > 0) {
            setDisplayedText(displayedText.slice(0, -1));
          } else {
            setIsDeleting(false);
            if (loop || currentWordIndex < words.length - 1) {
              setCurrentWordIndex((prev) => (prev + 1) % words.length);
            }
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, currentWordIndex, words, loop, delayBetweenWords]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{displayedText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-5 bg-cyan-400 ml-1"
      />
    </span>
  );
}
