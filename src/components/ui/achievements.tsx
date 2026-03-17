"use client";
import { motion } from "framer-motion";
import { Award, Star, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const achievementsData = [
  {
    title: '3x International Hackathon Winner',
    description: 'Won ETH Oxford, Paris Blockchain Week & Colosseum Breakout Hackathons. Created DEFAI and evolved it into synto.fun - an AI agent interface making Web3 effortless through chat-based interactions.',
    icon: <Trophy className="h-5 w-5 text-yellow-500" />,
    date: '2025',
  },
  {
    title: 'Gotta Go Hack AI Hackathon Winner',
    description: 'Developed a voice-based virtual salesperson accessible via QR code to improve customer-to-salesperson ratio. Created an AI pipeline with API calls and RAG implementation.',
    icon: <Award className="h-5 w-5 text-blue-500" />,
    date: '2024',
  },
  {
    title: 'École 42 Top Performer',
    description: 'Ranked 7th out of 500 students in the École 42 "piscine" (intensive bootcamp). Achieved final exam score of 84.13/100 in the Master’s Degree program.',
    icon: <Star className="h-5 w-5 text-purple-500" />,
    date: '2023',
  },
  {
    title: 'Professional Athlete Background',
    description: 'Former high-level mountain biking athlete in Cross-country, achieving Top 10 in French Cup and Top 15 in World Cup competitions.',
    icon: <Award className="h-5 w-5 text-green-500" />,
    date: '2022',
  },
  {
    title: 'Scientific Baccalaureate with Highest Honors',
    description: 'Graduated with Highest Honors (mention Très Bien) with a score of 16.77/20, specializing in Advanced Mathematics.',
    icon: <Star className="h-5 w-5 text-orange-500" />,
    date: '2022',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
  },
};

export default function Achievements() {
  return (
    <motion.div
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="mx-auto w-full max-w-5xl rounded-4xl"
    >
      <Card className="w-full border-none px-0 pb-12 shadow-none">
        <CardHeader className="px-0 pb-1">
          <CardTitle className="text-primary px-0 text-4xl font-bold">
            Achievements
          </CardTitle>
        </CardHeader>

        <CardContent className="px-0">
          <motion.div
            className="space-y-6 px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {achievementsData.map((achievement, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                className="bg-accent flex items-start gap-4 rounded-2xl p-6 transition-colors"
              >
                <div className="mt-1 flex-shrink-0">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-foreground text-lg font-semibold">
                      {achievement.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {achievement.date}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
