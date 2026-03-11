"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import AgenticLoader from "./AgenticLoader";
import CheckIcon from "./CheckIcon";
import StepConnector from "./StepConnector";

const STEPS = [
  "Gathering information",
  "Processing",
  "Planning",
  "Synthesizing",
  "Complete",
] as const;

type StepStatus = "pending" | "active" | "done";

interface StepState {
  status: StepStatus;
}

/**
 * Timing: each step becomes active after a staggered delay.
 * Steps 0–3 animate in, step 4 (Complete) is the final state.
 * Total sequence: ~1.5s start delay, then ~0.8s per step.
 */
const STEP_DELAYS_MS = [1500, 2800, 4100, 5400, 6700];

function getInitialStates(): StepState[] {
  return STEPS.map(() => ({ status: "pending" as StepStatus }));
}

interface StepRowProps {
  label: string;
  status: StepStatus;
  showConnectorAbove: boolean;
  connectorColor: "green" | "white";
  index: number;
}

function StepRow({ label, status, showConnectorAbove, connectorColor, index }: StepRowProps) {
  const isActive = status === "active";
  const isDone = status === "done";
  const isVisible = isActive || isDone;

  return (
    <motion.div
      className="flex flex-col items-start shrink-0 w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {showConnectorAbove && (
        <StepConnector color={connectorColor} visible={isVisible} />
      )}
      <div className="flex items-center gap-4 shrink-0 w-full">
        {isDone ? (
          <CheckIcon visible={isDone} />
        ) : (
          <AgenticLoader active={isActive} />
        )}
        <p
          className="shrink-0 whitespace-nowrap text-sm leading-5 not-italic"
          style={{
            fontFamily: "'Fragment Mono', monospace",
            fontSize: 14,
            lineHeight: "20px",
            color: isDone ? "#8eeda0" : "#ffffff",
          }}
        >
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export default function LoadingSyncAnimation() {
  const [stepStates, setStepStates] = useState<StepState[]>(getInitialStates());
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEP_DELAYS_MS.forEach((delay, i) => {
      // Activate step i
      timers.push(
        setTimeout(() => {
          setHasStarted(true);
          setStepStates((prev) => {
            const next = [...prev];
            // Mark previous step as done
            if (i > 0) {
              next[i - 1] = { status: "done" };
            }
            next[i] = { status: "active" };
            return next;
          });
        }, delay)
      );
    });

    // After last step activates, mark it done too
    timers.push(
      setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];
          next[STEPS.length - 1] = { status: "done" };
          return next;
        });
      }, STEP_DELAYS_MS[STEPS.length - 1] + 800)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const visibleSteps = stepStates.filter((s) => s.status !== "pending");

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 800, height: 800, backgroundColor: "#000000" }}
    >
      {/* Card */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 420,
          height: 420,
          backgroundColor: "#070707",
          border: "1px solid #111111",
          borderRadius: 16,
        }}
      >
        {/* Step list — centered in card */}
        <div
          className="flex flex-col items-start"
          style={{ gap: 0, width: 222 }}
        >
          {STEPS.map((label, i) => {
            const state = stepStates[i];
            const prevState = i > 0 ? stepStates[i - 1] : null;

            // Show connector above this step if previous step exists and is visible
            const showConnector = i > 0 && prevState !== null && prevState.status !== "pending";

            // Connector is green if both this step and previous are done
            const connectorColor: "green" | "white" =
              state.status === "done" && prevState?.status === "done"
                ? "green"
                : "white";

            return (
              <StepRow
                key={label}
                label={label}
                status={state.status}
                showConnectorAbove={showConnector}
                connectorColor={connectorColor}
                index={i}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
