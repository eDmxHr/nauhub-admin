"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface TableTransitionProps {
  isLoading: boolean;
  skeletonRows: ReactNode;
  children: ReactNode;
  staggerDelay?: number;
  transitionDuration?: number;
  containerClassName?: string;
  enableTransitions?: boolean;
  // Additional customization options
  enterDelay?: number;
  exitDelay?: number;
  easing?: [number, number, number, number];
}

const rowVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const skeletonExitVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

export function TableTransition({
  isLoading,
  skeletonRows,
  children,
  staggerDelay = 15,
  transitionDuration = 350,
  containerClassName = "",
  enableTransitions = true,
  enterDelay = 0.05,
  exitDelay = 0,
  easing = [0.4, 0, 0.2, 1],
}: TableTransitionProps) {
  // If transitions are disabled, return simple conditional rendering
  if (!enableTransitions) {
    return (
      <div className={containerClassName}>
        {isLoading ? skeletonRows : children}
      </div>
    );
  }

  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.tbody
          key="skeleton"
          initial="visible"
          animate="visible"
          exit="hidden"
          variants={skeletonExitVariants}
          transition={{
            duration: (transitionDuration / 1000) * 0.6,
            delay: exitDelay,
            ease: easing,
          }}
        >
          {skeletonRows}
        </motion.tbody>
      ) : (
        <motion.tbody
          key="content"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: staggerDelay / 1000,
                delayChildren: enterDelay,
              },
            },
          }}
        >
          {childrenArray.map((child, index) => (
            <motion.tr
              key={`table-row-${index}`}
              variants={rowVariants}
              transition={{
                duration: transitionDuration / 1000,
                ease: easing,
              }}
              className="will-change-transform"
              style={{ display: "table-row" }}
            >
              {child.props.children}
            </motion.tr>
          ))}
        </motion.tbody>
      )}
    </AnimatePresence>
  );
}
