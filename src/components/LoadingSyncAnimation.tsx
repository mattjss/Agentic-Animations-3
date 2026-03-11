"use client";

import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "motion/react";
import AgenticLoader from "./AgenticLoader";
import CheckIcon from "./CheckIcon";
import StepConnector from "./StepConnector";
import ShimmerText from "./ShimmerText";

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
  startedAt: number | null;
}

const PHASE_DURATION_MS = 5000;
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
      layout
      className="flex flex-col items-start shrink-0 w-full"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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
        <ShimmerText active={isActive} done={isDone}>
          {label}
        </ShimmerText>
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

    timers.push(setTimeout(() => setFading(true), RESET_AFTER_MS - 800));
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

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 800, height: 800, backgroundColor: "#000000" }}
    >
      <motion.div
        className="relative flex items-center justify-center"
        animate={{ opacity: fading ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        style={{
          width: 420,
          height: 420,
          backgroundColor: "#000000",
          border: "1px solid #111111",
          borderRadius: 16,
        }}
      >
        {/*
          LayoutGroup + layout on the wrapper means Motion tracks the container's
          size and smoothly recenters it as steps are added.
        */}
        <LayoutGroup>
          <motion.div
            layout
            className="flex flex-col items-start"
            style={{ width: 222 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
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
      </motion.div>
    </div>
  );
}
