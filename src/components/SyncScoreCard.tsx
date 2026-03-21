import { motion } from "framer-motion";
import { getCycleSyncScore, CycleEntry } from "@/lib/cycle-utils";
import { Activity } from "lucide-react";

interface Props {
  cycles: CycleEntry[];
}

const SyncScoreCard = ({ cycles }: Props) => {
  const score = getCycleSyncScore(cycles);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      className="glass-card-elevated p-6 flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center gap-2 mb-4 self-start">
        <Activity className="w-5 h-5 text-primary" />
        <p className="text-sm font-medium text-muted-foreground">Cycle Sync Score</p>
      </div>
      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
          <motion.circle
            cx="50" cy="50" r="40" fill="none"
            stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(340, 80%, 72%)" />
              <stop offset="100%" stopColor="hsl(280, 60%, 78%)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-foreground">{score}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        {score >= 80 ? "Very consistent! 🎯" : score >= 50 ? "Moderately regular" : score > 0 ? "Irregular pattern detected" : "Need 3+ cycles to calculate"}
      </p>
    </motion.div>
  );
};

export default SyncScoreCard;
