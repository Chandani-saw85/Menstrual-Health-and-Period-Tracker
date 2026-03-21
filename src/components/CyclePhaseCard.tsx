import { motion } from "framer-motion";
import { getCyclePhase, CycleEntry } from "@/lib/cycle-utils";

const phaseColors: Record<string, string> = {
  "Menstrual": "from-rose-300 to-rose-400",
  "Follicular": "from-emerald-300 to-teal-400",
  "Ovulation": "from-amber-300 to-orange-400",
  "Luteal": "from-lavender-300 to-lavender-400",
  "No Data": "from-muted to-muted",
  "Pre-Period": "from-lavender-200 to-rose-200",
};

interface Props {
  cycles: CycleEntry[];
}

const CyclePhaseCard = ({ cycles }: Props) => {
  const { phase, day, description } = getCyclePhase(cycles);
  const gradient = phaseColors[phase] || "from-primary to-accent";

  return (
    <motion.div
      className="glass-card-elevated p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-20 blur-2xl -translate-y-8 translate-x-8`} />
      <div className="relative z-10">
        <p className="text-sm font-medium text-muted-foreground mb-1">Current Phase</p>
        <h3 className="text-2xl font-bold text-foreground mb-1">{phase}</h3>
        {day > 0 && <p className="text-sm text-muted-foreground mb-3">Day {day} of cycle</p>}
        <p className="text-sm text-foreground/80">{description}</p>
      </div>
    </motion.div>
  );
};

export default CyclePhaseCard;
