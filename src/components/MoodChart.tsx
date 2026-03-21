import { motion } from "framer-motion";
import { format } from "date-fns";
import { MoodEntry, MOODS } from "@/lib/cycle-utils";
import { BarChart3 } from "lucide-react";

interface Props {
  moods: MoodEntry[];
}

const moodToValue: Record<string, number> = {
  "😊": 5, "🥰": 5, "😌": 4, "😴": 3, "😰": 2, "🤢": 2, "😢": 1, "😤": 1,
};

const MoodChart = ({ moods }: Props) => {
  const recent = moods.slice(-10);
  const maxVal = 5;

  return (
    <motion.div
      className="glass-card-elevated p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Mood Trends</h3>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Log moods to see your trends</p>
      ) : (
        <div className="flex items-end gap-2 h-32">
          {recent.map((m, i) => {
            const val = moodToValue[m.mood] || 3;
            const height = (val / maxVal) * 100;
            return (
              <div key={m.id} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs">{m.mood}</span>
                <motion.div
                  className="w-full rounded-t-lg"
                  style={{ background: "var(--gradient-primary)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                />
                <span className="text-[8px] text-muted-foreground">
                  {format(new Date(m.date), "d")}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default MoodChart;
