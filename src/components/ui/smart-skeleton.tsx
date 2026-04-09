"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useSmartSkeleton } from "@/hooks/use-smart-skeleton";
import { AnimatePresence, motion } from "framer-motion";

export interface SmartSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The active loading state.
   */
  isLoading?: boolean;
  /**
   * Delay in milliseconds before showing the skeleton to avoid flicker.
   */
  delayMs?: number;
  /**
   * Content to reveal once loading is complete.
   */
  children?: React.ReactNode;
}

/**
 * A Skeleton wrapper that only shows the loading placeholder if loading takes
 * longer than delayMs (preventing flash on fast loads). Includes a smooth
 * fade-in/out and a shimmer animation.
 */
export function SmartSkeleton({
  isLoading = true,
  delayMs = 300,
  className,
  children,
  ...props
}: SmartSkeletonProps) {
  const showSkeleton = useSmartSkeleton(isLoading, delayMs);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        showSkeleton ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative overflow-hidden rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80 border border-neutral-300/50 dark:border-neutral-700/50",
              className
            )}
            {...props}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 z-10 w-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
              }}
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 1.2,
                ease: "linear",
              }}
            />
          </motion.div>
        ) : null // Waiting to show skeleton (avoids flicker)
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("h-full w-full", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Basic reusable Skeleton block with shimmer animation (no smart delay).
 */
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-neutral-200/80 dark:bg-neutral-800/80 border border-neutral-300/50 dark:border-neutral-700/50",
        className
      )}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-10 w-full"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)",
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.2,
          ease: "linear",
        }}
      />
    </div>
  );
}
