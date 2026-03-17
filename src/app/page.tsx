"use client";
import FloatingChatBubble from "@/components/FloatingChatBubble";
import FluidCursor from "@/components/FluidCursor";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
  ArrowRight,
  BriefcaseBusiness,
  Layers,
  Trophy,
  UserRoundSearch,
  BookOpen,
  Award,
} from 'lucide-react';

const questions = {
  Me: 'Tell me about yourself',
  Projects: 'Show my projects',
  Skills: 'Show my skills',
  Achievements: 'Show my achievements',
  Training: 'Show my training',
  Certifications: 'Show my certifications',
  Contact: 'How can someone contact me?',
} as const;

const questionConfig = [
  { key: 'Me', color: '#2563EB', icon: UserRoundSearch },
  { key: 'Projects', color: '#3E9858', icon: BriefcaseBusiness },
  { key: 'Skills', color: '#856ED9', icon: Layers },
  { key: 'Achievements', color: '#E6A817', icon: Trophy },
  { key: 'Training', color: '#F76D57', icon: BookOpen },
  { key: 'Certifications', color: '#0EA5E9', icon: Award },
  { key: 'Contact', color: '#C19433', icon: UserRoundSearch },
] as const;

/* ---------- component ---------- */
export default function Home() {
  const [input, setInput] = useState('');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const goToChat = (query: string) =>
    router.push(`/chat?query=${encodeURIComponent(query)}`);

  /* hero animations (unchanged) */
  const topElementVariants = {
    hidden: { opacity: 0, y: -60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };
  const bottomElementVariants = {
    hidden: { opacity: 0, y: 80 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: 0.2 },
    },
  };

  useEffect(() => {
    // No preloads needed since we migrated away from video memoji assets.
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* big blurred footer word */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: '-2.5rem' }}
        >
          Portfolio
        </div>
      </div>

      {/* header */}
      <motion.div
       className="z-1 mt-10 mb-30 flex flex-col items-center text-center md:mt-4 md:mb-6"
        variants={topElementVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-secondary-foreground mt-1 text-xl font-semibold md:text-2xl">
          Hey, I'm 👋
        </h2>
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          Arshdeep Singh
        </h1>
      </motion.div>

      {/* centre memoji */}
        <div className="relative z-10 mx-auto h-48 w-48 sm:h-56 sm:w-56 mt-6 mb-2 rounded-full overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800">
        <Image
          src="/landing_avatar.png"
          alt="Arshdeep Singh"
          width={250}
          height={250}
          priority
          className="h-full w-full object-cover"
        />
      </div>

      {/* input + quick buttons */}
      <motion.div
        variants={bottomElementVariants}
        initial="hidden"
        animate="visible"
      className="z-10 mt-2 flex w-full flex-col items-center justify-center md:px-0"
      >
        {/* free-form question */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) goToChat(input.trim());
          }}
          className="relative w-full max-w-lg"
        >
          <div className="mx-auto flex items-center rounded-full border border-neutral-200 bg-white/30 py-2.5 pr-2 pl-6 backdrop-blur-lg transition-all hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="w-full border-none bg-transparent text-base text-neutral-800 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Submit question"
              className="flex items-center justify-center rounded-full bg-[#0171E3] p-2.5 text-white transition-colors hover:bg-blue-600 disabled:opacity-70 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </form>

        {/* quick-question grid */}
        <div className="mt-5 flex flex-col items-center gap-2 w-full max-w-2xl">
          {/* Row 1: First 5 Cards */}
          <div className="grid w-full grid-cols-5 gap-2">
            {questionConfig.slice(0, 5).map(({ key, color, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => goToChat(questions[key])}
                variant="outline"
                className="border-border hover:bg-border/30 aspect-square w-full cursor-pointer rounded-2xl border bg-white/30 h-20 shadow-none backdrop-blur-lg active:scale-95"
              >
                <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
                  <Icon size={22} strokeWidth={2} color={color} />
                  <span className="text-[10px] md:text-xs font-medium">{key}</span>
                </div>
              </Button>
            ))}
          </div>

          {/* Row 2: Remaining 2 Cards Centered */}
          <div className="grid w-1/2 max-w-xs grid-cols-2 gap-2">
            {questionConfig.slice(5).map(({ key, color, icon: Icon }) => (
              <Button
                key={key}
                onClick={() => goToChat(questions[key])}
                variant="outline"
                className="border-border hover:bg-border/30 aspect-square w-full cursor-pointer rounded-2xl border bg-white/30 h-20 shadow-none backdrop-blur-lg active:scale-95"
              >
                <div className="flex h-full flex-col items-center justify-center gap-1 text-gray-700">
                  <Icon size={22} strokeWidth={2} color={color} />
                  <span className="text-[10px] md:text-xs font-medium">{key}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      <FluidCursor />
      <FloatingChatBubble />
    </div>
  );
}
