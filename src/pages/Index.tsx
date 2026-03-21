import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { generateSampleData, CycleEntry, MoodEntry, JournalEntry } from "@/lib/cycle-utils";
import AnimatedPad from "@/components/AnimatedPad";
import CyclePhaseCard from "@/components/CyclePhaseCard";
import PredictionCard from "@/components/PredictionCard";
import SyncScoreCard from "@/components/SyncScoreCard";
import MoodTracker from "@/components/MoodTracker";
import MoodChart from "@/components/MoodChart";
import InsightCard from "@/components/InsightCard";
import Journal from "@/components/Journal";
import ReminderBanner from "@/components/ReminderBanner";
import LogCycleModal from "@/components/LogCycleModal";
import { CalendarPlus, Heart } from "lucide-react";

const Index = () => {
  const sampleData = useMemo(() => generateSampleData(), []);
  const [cycles, setCycles] = useState<CycleEntry[]>(sampleData.cycles);
  const [moods, setMoods] = useState<MoodEntry[]>(sampleData.moods);
  const [journals, setJournals] = useState<JournalEntry[]>(sampleData.journals);
  const [showLogModal, setShowLogModal] = useState(false);

  const addCycle = (entry: CycleEntry) => setCycles((prev) => [...prev, entry]);
  const addMood = (entry: MoodEntry) => setMoods((prev) => [...prev.filter((m) => m.date !== entry.date), entry]);
  const addJournal = (entry: JournalEntry) => setJournals((prev) => [...prev, entry]);

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card border-b border-border/30 rounded-none">
        <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AnimatedPad />
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-1.5">
                Luna <Heart className="w-4 h-4 text-primary fill-primary" />
              </h1>
              <p className="text-xs text-muted-foreground">Period & Wellness Tracker</p>
            </div>
          </div>
          <motion.button
            className="btn-gradient flex items-center gap-2 text-sm py-2.5 px-5"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowLogModal(true)}
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Log Period</span>
          </motion.button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Reminder */}
        <ReminderBanner cycles={cycles} />

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CyclePhaseCard cycles={cycles} />
          <PredictionCard cycles={cycles} />
          <SyncScoreCard cycles={cycles} />
        </div>

        {/* Insight */}
        <InsightCard cycles={cycles} />

        {/* Mood & Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MoodTracker moods={moods} onAddMood={addMood} />
          <MoodChart moods={moods} />
        </div>

        {/* Journal */}
        <Journal entries={journals} onAdd={addJournal} />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-muted-foreground">
        Made with 💕 for your wellness journey
      </footer>

      {/* Modal */}
      <LogCycleModal isOpen={showLogModal} onClose={() => setShowLogModal(false)} onAdd={addCycle} />
    </div>
  );
};

export default Index;
