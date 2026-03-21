import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { MOODS, MoodEntry } from "@/lib/cycle-utils";
import { Smile } from "lucide-react";

interface Props {
  moods: MoodEntry[];
  onAddMood: (mood: MoodEntry) => void;
}

const MoodTracker = ({ moods, onAddMood }: Props) => {
  const [selected, setSelected] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayMood = moods.find((m) => m.date === today);
  const recentMoods = moods.slice(-7);

  const handleSelect = (emoji: string, label: string) => {
    setSelected(emoji);
    onAddMood({
      id: Date.now().toString(),
      date: today,
      mood: emoji,
      label,
    });
  };

  return (
    <motion.div
      className="glass-card-elevated p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Smile className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">How are you feeling?</h3>
      </div>

      {todayMood ? (
        <div className="text-center py-4">
          <span className="text-4xl">{todayMood.mood}</span>
          <p className="text-sm text-muted-foreground mt-2">You're feeling {todayMood.label} today</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {MOODS.map(({ emoji, label }) => (
            <motion.button
              key={emoji}
              className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(emoji, label)}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-[10px] text-muted-foreground">{label}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Recent mood bar */}
      <div className="mt-5 pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground mb-2">Last 7 days</p>
        <div className="flex justify-between">
          {recentMoods.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-1">
              <span className="text-lg">{m.mood}</span>
              <span className="text-[9px] text-muted-foreground">{format(new Date(m.date), "EEE")}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodTracker;
