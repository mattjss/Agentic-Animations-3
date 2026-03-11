"use client";

import { motion } from "motion/react";

interface StepConnectorProps {
  /** "green" = both sides done, "white" = leading to active step */
  color: "green" | "white";
  visible?: boolean;
}

const DOTS = [0, 1, 2, 3];

export default function StepConnector({ color, visible = true }: StepConnectorProps) {
  const dotColor = color === "green" ? "#8eeda0" : "#ffffff";

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: 24, height: 24, paddingLeft: 48, paddingRight: 48 }}
    >
      <div className="flex flex-col items-start shrink-0" style={{ gap: 3, width: 2 }}>
        {DOTS.map((i) => (
          <motion.div
            key={i}
            className="shrink-0 rounded-sm"
            style={{ width: 1, height: 3, backgroundColor: dotColor }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={visible ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.25, delay: i * 0.05, ease: "easeOut" }}
          />
        ))}
      </div>
    </div>
  );
}
