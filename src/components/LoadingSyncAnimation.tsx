"use client";

import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import AgenticLoader from "./AgenticLoader";
import CheckIcon from "./CheckIcon";
import StepConnector from "./StepConnector";
import MatrixScrambleText from "./MatrixScrambleText";

const STEPS = [
  "Syncing state",
  "Loading context",
  "Processing query",
  "Reasoning",
  "Complete",
] as const;

type StepStatus = "pending" | "active" | "done";

interface StepState {
  status: StepStatus;
  startedAt: number | null;
}

const PHASE_DURATION_MS = 2000; // type + shimmer once
const INITIAL_DELAY_MS = 1500;
const STEP_DELAYS_MS = STEPS.map((_, i) => INITIAL_DELAY_MS + PHASE_DURATION_MS * i);
const COMPLETE_AT_MS = STEP_DELAYS_MS[STEPS.length - 1] + PHASE_DURATION_MS;
const RESET_AFTER_MS = COMPLETE_AT_MS + 6000;

function getInitialStates(): StepState[] {
  return STEPS.map(() => ({ status: "pending", startedAt: null }));
}

interface StepRowProps {
  label: string;
  status: StepStatus;
  prevStatus: StepStatus;
  prevStartedAt: number | null;
  showConnector: boolean;
}

function StepRow({ label, status, prevStatus, prevStartedAt, showConnector }: StepRowProps) {
  const isActive = status === "active";
  const isDone = status === "done";

  return (
    <motion.div
      layout="position"
      className="flex flex-col items-start shrink-0 w-full"
      style={{ gap: 8 }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
    >
      {showConnector && (
        <StepConnector
          stepStartedAt={prevStartedAt}
          done={isDone && prevStatus === "done"}
        />
      )}
      <div className="flex items-center shrink-0 w-full" style={{ gap: 16 }}>
        {isDone ? (
          <CheckIcon visible={true} />
        ) : (
          <AgenticLoader active={isActive} />
        )}
        <MatrixScrambleText active={isActive} done={isDone}>
          {label}
        </MatrixScrambleText>
      </div>
    </motion.div>
  );
}

export default function LoadingSyncAnimation() {
  const [stepStates, setStepStates] = useState<StepState[]>(getInitialStates());
  const [cycle, setCycle] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    STEP_DELAYS_MS.forEach((delay, i) => {
      timers.push(
        setTimeout(() => {
          const now = Date.now();
          setStepStates((prev) => {
            const next = [...prev];
            if (i > 0) next[i - 1] = { ...next[i - 1], status: "done" };
            next[i] = { status: "active", startedAt: now };
            return next;
          });
        }, delay)
      );
    });

    timers.push(
      setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];
          next[STEPS.length - 1] = { ...next[STEPS.length - 1], status: "done" };
          return next;
        });
      }, COMPLETE_AT_MS)
    );

    timers.push(setTimeout(() => setFading(true), RESET_AFTER_MS - 150));
    timers.push(
      setTimeout(() => {
        setStepStates(getInitialStates());
        setFading(false);
        setCycle((c) => c + 1);
      }, RESET_AFTER_MS)
    );

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  const visibleSteps = stepStates
    .map((s, i) => ({ ...s, index: i }))
    .filter((s) => s.status !== "pending");

  const isComplete = stepStates[STEPS.length - 1].status === "done";

  const hasActiveStep = stepStates.some((s) => s.status === "active");

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 800, height: 800, backgroundColor: "#000000" }}
    >
      <motion.div
        className="relative flex flex-col overflow-hidden"
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: 0 }}
        style={{
          width: 420,
          minHeight: 420,
          backgroundColor: "#000000",
          border: "1px solid #1a1a1a",
          borderRadius: 16,
        }}
      >
        {/* Top-edge signal — kept per user preference */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              hasActiveStep || isComplete
                ? `linear-gradient(90deg, transparent, #45eecc, transparent)`
                : "transparent",
            opacity: isComplete ? 0.6 : hasActiveStep ? 0.4 : 0,
            transition: "opacity 0.4s ease",
          }}
        />

        {/* Fixed header — process label + status, does not move with steps */}
        <div
          className="absolute left-0 right-0 flex items-center justify-between"
          style={{
            top: 20,
            paddingLeft: 24,
            paddingRight: 24,
            fontFamily: "'Fragment Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.35)" }}>Process</span>
          <span
            style={{
              color: hasActiveStep ? "rgba(69,238,204,0.8)" : isComplete ? "rgba(69,238,204,0.6)" : "rgba(255,255,255,0.2)",
              transition: "color 0.3s ease",
            }}
          >
            {isComplete ? "Ready" : hasActiveStep ? "Syncing" : "Idle"}
          </span>
        </div>

        {/* Separator — subtle line between header and content */}
        <div
          style={{
            position: "absolute",
            top: 44,
            left: 24,
            right: 24,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
          }}
        />

        {/* Bottom-edge signal — mirrors top when complete for frame balance */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: isComplete ? `linear-gradient(90deg, transparent, #45eecc, transparent)` : "transparent",
            opacity: isComplete ? 0.35 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Steps — centered in remaining space, fixed top offset for header */}
        <div
          className="absolute inset-x-0 flex justify-center items-center"
          style={{ top: 72, bottom: 32 }}
        >
          <LayoutGroup>
            <motion.div
              layout="position"
              className="flex flex-col items-start justify-center"
              style={{ width: 222, gap: 8, margin: "0 auto" }}
              transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
            >
            {visibleSteps.map((s) => {
              const prevState = s.index > 0 ? stepStates[s.index - 1] : null;
              const showConnector =
                s.index > 0 &&
                prevState !== null &&
                prevState.status !== "pending";

              return (
                <StepRow
                  key={STEPS[s.index]}
                  label={STEPS[s.index]}
                  status={s.status}
                  prevStatus={prevState?.status ?? "pending"}
                  prevStartedAt={prevState?.startedAt ?? null}
                  showConnector={showConnector}
                />
              );
            })}
            </motion.div>
          </LayoutGroup>
        </div>
      </motion.div>
    </div>
  );
}
