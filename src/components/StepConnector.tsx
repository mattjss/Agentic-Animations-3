"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface StepConnectorProps {
  /** Timestamp (Date.now()) when the step above this connector became active */
  stepStartedAt: number | null;
  /** True once the step below this connector is done (turn all dashes green) */
  done: boolean;
}

const NUM_DASHES = 4;
const DASH_INTERVAL_MS = 500; // 4 dashes over ~2s

export default function StepConnector({ stepStartedAt, done }: StepConnectorProps) {
  const [filledCount, setFilledCount] = useState(0);

  useEffect(() => {
    if (stepStartedAt === null) {
      setFilledCount(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    for (let i = 0; i < NUM_DASHES; i++) {
      const elapsed = Date.now() - stepStartedAt;
      const targetDelay = (i + 1) * DASH_INTERVAL_MS;
      const remaining = Math.max(0, targetDelay - elapsed);

      timers.push(
        setTimeout(() => {
          setFilledCount(i + 1);
        }, remaining)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [stepStartedAt]);

  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{ width: 24, height: 24 }}
    >
      <div className="flex flex-col items-center shrink-0" style={{ gap: 3, width: 1 }}>
        {Array.from({ length: NUM_DASHES }, (_, i) => {
          const isFilled = i < filledCount;
          const color = done ? "#8eeda0" : isFilled ? "#ffffff" : "rgba(255,255,255,0.2)";

          return (
            <motion.div
              key={i}
              className="shrink-0 rounded-sm"
              style={{ width: 1, height: 3, transformOrigin: "center" }}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{
                opacity: stepStartedAt !== null ? 1 : 0,
                scaleY: stepStartedAt !== null ? 1 : 0,
                backgroundColor: color,
              }}
              transition={{
                opacity:         { duration: 0.35, delay: i * 0.05, ease: [0.32, 0.72, 0, 1] },
                scaleY:          { duration: 0.35, delay: i * 0.05, ease: [0.32, 0.72, 0, 1] },
                backgroundColor: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
