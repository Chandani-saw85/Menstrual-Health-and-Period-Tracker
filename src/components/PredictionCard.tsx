import { motion } from "framer-motion";
import { differenceInDays, format } from "date-fns";
import { predictNextPeriod, CycleEntry } from "@/lib/cycle-utils";
import { CalendarHeart } from "lucide-react";

interface Props {
  cycles: CycleEntry[];
}

const PredictionCard = ({ cycles }: Props) => {
  const nextDate = predictNextPeriod(cycles);
  const daysUntil = nextDate ? differenceInDays(nextDate, new Date()) : null;

  return (
    <motion.div
      className="glass-card-elevated p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl -translate-y-6 translate-x-6" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <CalendarHeart className="w-5 h-5 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Next Period</p>
        </div>
        {nextDate ? (
          <>
            <h3 className="text-2xl font-bold text-foreground">{format(nextDate, "MMM d, yyyy")}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {daysUntil !== null && daysUntil > 0
                ? `In ${daysUntil} day${daysUntil !== 1 ? "s" : ""}`
                : daysUntil === 0
                ? "Expected today"
                : "May have started"}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Log a cycle to see predictions</p>
        )}
      </div>
    </motion.div>
  );
};

export default PredictionCard;
