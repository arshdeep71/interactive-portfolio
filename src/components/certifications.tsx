"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Award, ExternalLink, Link2 } from 'lucide-react';
import { portfolioData } from '@/data/portfolioData';

export default function Certifications() {
  return (
    <div className="mx-auto w-full max-w-5xl py-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="mb-2 flex items-center gap-3">
          <Award className="text-secondary-foreground h-8 w-8" />
          <h2 className="from-foreground to-muted-foreground bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
            Certifications
          </h2>
        </div>
        <p className="text-muted-foreground mt-4 text-lg">
          Verified skills and industry-recognized coursework.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolioData.certifications.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-[#F5F5F7] p-8 dark:bg-[#1D1D1F]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:from-green-400/5" />
            
            <div className="relative z-10 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/30">
                <Award className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium tracking-wide text-green-600 dark:text-green-500 uppercase flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                  {item.issuer}
                </p>
                <h3 className="mt-2 text-xl font-bold text-neutral-800 dark:text-neutral-100 leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex items-center justify-between border-t border-neutral-200 pt-5 dark:border-neutral-800">
              <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Issued {item.date}
              </span>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-black/5 px-4 py-1.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  <Link2 className="h-4 w-4" />
                  Verify
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
