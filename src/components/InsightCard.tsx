import { motion } from "framer-motion";
import { getDailyInsight, CycleEntry } from "@/lib/cycle-utils";
import { Lightbulb } from "lucide-react";

interface Props {
  cycles: CycleEntry[];
}

const InsightCard = ({ cycles }: Props) => {
  const insight = getDailyInsight(cycles);

  return (
    <motion.div
      className="glass-card p-5 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-amber-200/30 to-orange-200/30 blur-xl" />
      <div className="relative z-10 flex gap-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground mb-1">Daily Insight</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightCard;
