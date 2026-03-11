"use client";

import { motion } from "motion/react";

/**
 * 3×3 grid loader — cells pulse from 0.06 → 1 → 0.06 opacity
 * with an 80ms stagger across 9 cells (left-to-right, top-to-bottom).
 */

const CELLS = Array.from({ length: 9 }, (_, i) => i);
const CELL_SIZE = 8;
const STAGGER_MS = 80;
const DURATION_S = 1.4;

interface AgenticLoaderProps {
  active?: boolean;
}

export default function AgenticLoader({ active = true }: AgenticLoaderProps) {
  return (
    <div
      className="shrink-0 grid"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(3, ${CELL_SIZE}px)`,
        gridTemplateRows: `repeat(3, ${CELL_SIZE}px)`,
        width: 24,
        height: 24,
      }}
    >
      {CELLS.map((i) => (
        <motion.div
          key={i}
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            backgroundColor: "#f0f0ff",
          }}
          animate={
            active
              ? { opacity: [0.06, 1, 0.06] }
              : { opacity: 0.06 }
          }
          transition={
            active
              ? {
                  duration: DURATION_S,
                  repeat: Infinity,
                  delay: (i * STAGGER_MS) / 1000,
                  ease: [0.4, 0, 0.2, 1],
                }
              : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
          }
        />
      ))}
    </div>
  );
}
