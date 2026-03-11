"use client";

import { motion } from "motion/react";

interface CheckIconProps {
  visible?: boolean;
}

export default function CheckIcon({ visible = true }: CheckIconProps) {
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ width: 24, height: 24 }}>
      <motion.svg
        width="18"
        height="14"
        viewBox="0 0 18 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
        style={{ left: "12.5%", top: "20.83%" }}
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.path
          d="M1.5 7L6.5 12L16.5 2"
          stroke="#8eeda0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={visible ? { pathLength: 1 } : { pathLength: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
        />
      </motion.svg>
    </div>
  );
}
