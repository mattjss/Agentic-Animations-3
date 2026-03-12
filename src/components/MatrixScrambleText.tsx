"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const SCRAMBLE_FRAMES = 1;
const FRAME_MS = 6;
const SHIMMER_DURATION_MS = 900;

interface MatrixScrambleTextProps {
  children: string;
  active: boolean;
  done: boolean;
}

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export default function MatrixScrambleText({ children, active, done }: MatrixScrambleTextProps) {
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"idle" | "typing" | "shimmering" | "confirmed">("idle");
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setDisplay("");
      setPhase("idle");
      return;
    }

    const target = children;
    setPhase("typing");
    setDisplay("");

    let charIndex = 0;
    let frame = 0;

    const tick = (now: number) => {
      if (now - lastTickRef.current < FRAME_MS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastTickRef.current = now;

      if (charIndex >= target.length) {
        if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
        setPhase("shimmering");
        return;
      }

      if (frame < SCRAMBLE_FRAMES) {
        setDisplay(target.slice(0, charIndex) + randomChar());
        frame += 1;
      } else {
        setDisplay(target.slice(0, charIndex + 1));
        charIndex += 1;
        frame = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame((now) => {
      lastTickRef.current = now;
      tick(now);
    });

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [children, active]);

  useEffect(() => {
    if (phase !== "shimmering") return;
    const t = setTimeout(() => setPhase("confirmed"), SHIMMER_DURATION_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const baseStyle: React.CSSProperties = {
    fontFamily: "'Fragment Mono', monospace",
    fontSize: 14,
    lineHeight: "20px",
    whiteSpace: "nowrap",
    display: "inline-block",
    fontVariantNumeric: "tabular-nums",
  };

  if (done) {
    return (
      <motion.span
        style={{ ...baseStyle, color: "#45eecc" }}
        initial={false}
        animate={{ color: "#45eecc" }}
        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.span>
    );
  }

  if (active) {
    const isShimmering = phase === "shimmering";
    return (
      <span
        style={{
          ...baseStyle,
          color: "#ffffff",
          ...(isShimmering && {
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.95) 25%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.95) 75%, rgba(255,255,255,0.15) 100%)",
            backgroundSize: "200% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer-wave 0.9s ease-in-out forwards",
          }),
        }}
      >
        {isShimmering || phase === "confirmed" ? children : display}
      </span>
    );
  }

  return <span style={{ ...baseStyle, color: "#ffffff" }}>{children}</span>;
}
