import AppNavbar from "@/components/AppNavbar";
import PhaseDetailsModal from "@/components/dashboard/PhaseDetailsModal";
import HormoneGraph from "@/components/dashboard/HormoneGraph";
import FertilityWindow from "@/components/dashboard/FertilityWindow";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { getCycles } from "@/lib/database";
import { getCyclePhase, getSyncScore, predictNextPeriod } from "@/lib/cycle-utils";
import { useState, useEffect } from "react";
import { seedSampleData } from "@/lib/database";
import { format } from "date-fns";

const CycleInsights = () => {
  useEffect(() => { seedSampleData(); }, []);
  const cycles = getCycles();
  const { phase, day, description, icon } = getCyclePhase(cycles);
  const syncScore = getSyncScore(cycles);
  const nextPeriod = predictNextPeriod(cycles);
  const [showPhases, setShowPhases] = useState(false);

  return (
    <div className="min-h-screen" style={{
      background: "linear-gradient(135deg, hsl(340,80%,96%), hsl(270,60%,95%), hsl(200,60%,96%))",
    }}>
      <AppNavbar />
      <main className="container max-w-5xl mx-auto px-4 py-6 space-y-6">
        <h2 className="font-display text-3xl font-extrabold text-foreground">🔬 Cycle Insights</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setShowPhases(true)} className="fun-card-pink text-left group cursor-pointer">
            <span className="text-3xl">{icon}</span>
            <p className="font-display text-xl font-bold text-foreground mt-2">{phase}</p>
            <p className="text-sm text-muted-foreground">{day > 0 ? `Day ${day}` : ""} — {description}</p>
            <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">View all phases →</p>
          </button>

          <div className="fun-card-purple">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Next Period</p>
            <p className="font-display text-2xl font-extrabold text-foreground">
              {nextPeriod ? format(nextPeriod, "MMM d, yyyy") : "—"}
            </p>
          </div>

          <div className="fun-card-mint">
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Sync Score</p>
            <p className="font-display text-3xl font-extrabold text-foreground">{syncScore}<span className="text-lg">/100</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HormoneGraph />
          <FertilityWindow cycles={cycles} />
        </div>

        <SmartInsights cycles={cycles} />
      </main>

      {showPhases && <PhaseDetailsModal onClose={() => setShowPhases(false)} cycles={cycles} />}
    </div>
  );
};

export default CycleInsights;
