import { motion } from "framer-motion";
import { differenceInDays } from "date-fns";
import { predictNextPeriod, CycleEntry } from "@/lib/cycle-utils";
import { Bell } from "lucide-react";

interface Props {
  cycles: CycleEntry[];
}

const ReminderBanner = ({ cycles }: Props) => {
  const nextDate = predictNextPeriod(cycles);
  if (!nextDate) return null;

  const daysUntil = differenceInDays(nextDate, new Date());
  if (daysUntil > 3 || daysUntil < 0) return null;

  return (
    <motion.div
      className="gradient-primary rounded-2xl p-4 flex items-center gap-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
        <Bell className="w-5 h-5 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm font-semibold text-primary-foreground">
          {daysUntil === 0 ? "Your period is expected today!" : `Period expected in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}!`}
        </p>
        <p className="text-xs text-primary-foreground/80">Prepare ahead and take care of yourself 💕</p>
      </div>
    </motion.div>
  );
};

export default ReminderBanner;
