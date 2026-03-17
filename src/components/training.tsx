"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export default function Training() {
  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-3">
          <GraduationCap className="text-secondary-foreground h-8 w-8" />
          <h2 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            Summer Training
          </h2>
        </div>
        <p className="text-muted-foreground mt-4 text-lg">
          Intensive coursework and professional enhancement programs.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6">
        {portfolioData.training.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-blue-400/5" />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-2">
                    <BookOpen className="h-5 w-5" />
                    <span className="font-semibold text-sm tracking-wide uppercase">{item.institution}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                    {item.title}
                  </h3>
                  <div className="inline-block mt-2 rounded-full bg-neutral-200/80 px-4 py-1.5 text-xs font-semibold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    {item.date}
                  </div>
                </div>
                
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 dark:bg-white dark:text-black self-start"
                  >
                    View Certificate
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
              
              <div className="mt-4 space-y-3">
                {item.points.map((point, i) => (
                  <div key={i} className="flex items-start">
                    <div className="mr-3 mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <p className="text-secondary-foreground text-base leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              {item.certificateId && (
                <div className="mt-4 border-t border-neutral-200 dark:border-neutral-800 pt-4 flex items-center">
                  <span className="text-sm font-mono text-muted-foreground bg-neutral-200/50 dark:bg-neutral-800/50 px-3 py-1 rounded-md">
                    Cert ID: {item.certificateId}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
