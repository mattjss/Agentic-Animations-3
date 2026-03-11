"use client";

import { motion } from "motion/react";

/**
 * The 4×4 pixel grid loader icon from Figma.
 * Dots arranged in a bracket/corner pattern with varying opacities.
 * Animates with a wave/pulse effect when active.
 */

const DOT_POSITIONS = [
  { x: 0,  y: 0,  opacity: 0.8 },
  { x: 6,  y: 0,  opacity: 0.6 },
  { x: 12, y: 0,  opacity: 0.2 },
  { x: 18, y: 0,  opacity: 0.1 },
  { x: 0,  y: 6,  opacity: 0.8 },
  { x: 18, y: 6,  opacity: 0.1 },
  { x: 0,  y: 12, opacity: 0.8 },
  { x: 18, y: 12, opacity: 0.1 },
  { x: 0,  y: 18, opacity: 0.8 },
  { x: 6,  y: 18, opacity: 0.6 },
  { x: 12, y: 18, opacity: 0.2 },
  { x: 18, y: 18, opacity: 0.1 },
];

interface AgenticLoaderProps {
  active?: boolean;
}

export default function AgenticLoader({ active = true }: AgenticLoaderProps) {
  return (
    <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
      {DOT_POSITIONS.map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-none"
          style={{
            width: 6,
            height: 6,
            left: dot.x,
            top: dot.y,
            backgroundColor: "rgba(255,255,255,1)",
          }}
          animate={
            active
              ? {
                  opacity: [dot.opacity, Math.min(dot.opacity + 0.4, 1), dot.opacity],
                }
              : { opacity: dot.opacity }
          }
          transition={
            active
              ? {
                  duration: 1.2,
                  repeat: Infinity,
                  delay: (dot.x + dot.y) * 0.015,
                  ease: "easeInOut",
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}
