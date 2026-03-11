"use client";

import { motion } from "motion/react";

interface ShimmerTextProps {
  children: string;
  active: boolean;
  done: boolean;
}

export default function ShimmerText({ children, active, done }: ShimmerTextProps) {
  const baseStyle: React.CSSProperties = {
    fontFamily: "'Fragment Mono', monospace",
    fontSize: 14,
    lineHeight: "20px",
    whiteSpace: "nowrap",
    display: "inline-block",
  };

  if (done) {
    return (
      <motion.span
        style={{ ...baseStyle, color: "#8eeda0" }}
        initial={{ color: "#ffffff" }}
        animate={{ color: "#8eeda0" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.span>
    );
  }

  if (active) {
    return (
      <span
        style={{
          ...baseStyle,
          // Clip a moving gradient to the text
          background:
            "linear-gradient(90deg, rgba(180,180,180,0.4) 0%, rgba(160,160,160,0.6) 15%, rgba(255,255,255,0.95) 30%, rgba(240,240,255,1) 40%, rgba(255,255,255,1) 50%, rgba(240,240,255,1) 60%, rgba(255,255,255,0.95) 70%, rgba(160,160,160,0.6) 85%, rgba(180,180,180,0.4) 100%)",
          backgroundSize: "300% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "shimmer 2.5s linear infinite",
        }}
      >
        {children}
      </span>
    );
  }

  return (
    <span style={{ ...baseStyle, color: "#ffffff" }}>
      {children}
    </span>
  );
}
