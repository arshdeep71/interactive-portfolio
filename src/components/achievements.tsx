"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowUpRight } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export default function Achievements() {
  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-3">
          <Trophy className="text-secondary-foreground h-8 w-8" />
          <h2 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            Achievements
          </h2>
        </div>
        <p className="text-muted-foreground mt-4 text-lg">
          Milestones, recognitions, and innovative contributions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {portfolioData.achievements.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]"
          >
            {/* Background Gradient Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-yellow-400/5" />
            
            <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100 dark:bg-yellow-900/30">
                    <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                    Patent Filed
                  </h3>
                </div>
                
                <p className="text-secondary-foreground text-base leading-relaxed md:text-lg">
                  {item}
                </p>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    Indian Patent Office
                  </span>
                  <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                    Innovation
                  </span>
                </div>
              </div>

              {/* Optional external link stub */}
              <div className="flex items-center md:items-start">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:bg-white/10 shrink-0">
                  <ArrowUpRight className="h-5 w-5 text-neutral-600 dark:text-neutral-300" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {portfolioData.achievements.length === 0 && (
          <div className="rounded-3xl bg-[#F5F5F7] p-8 text-center dark:bg-[#1D1D1F]">
            <p className="text-muted-foreground">More achievements coming soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
