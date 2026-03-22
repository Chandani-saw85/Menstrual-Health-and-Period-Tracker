import { predictNextPeriod, CycleEntry } from "@/lib/cycle-utils";
import { differenceInDays } from "date-fns";

interface FertilityWindowProps {
  cycles: CycleEntry[];
}

const FertilityWindow = ({ cycles }: FertilityWindowProps) => {
  const nextPeriod = predictNextPeriod(cycles);
  if (!nextPeriod || cycles.length === 0) {
    return (
      <div className="fun-card-peach">
        <h3 className="font-display text-lg font-bold text-foreground mb-2">🌺 Fertility Window</h3>
        <p className="text-sm text-muted-foreground">Log more cycles to see your fertility window</p>
      </div>
    );
  }

  const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  const lastStart = sorted[0].startDate;
  const cycleLen = differenceInDays(nextPeriod, lastStart);
  const dayInCycle = differenceInDays(new Date(), lastStart);

  // Fertility window: typically days 10-17 of a 28-day cycle
  const fertileStart = Math.round(cycleLen * 0.36); // ~day 10
  const fertileEnd = Math.round(cycleLen * 0.61);   // ~day 17
  const ovulationDay = Math.round(cycleLen * 0.5);  // ~day 14

  const isFertile = dayInCycle >= fertileStart && dayInCycle <= fertileEnd;

  return (
    <div className="fun-card-peach">
      <h3 className="font-display text-lg font-bold text-foreground mb-3">🌺 Fertility Window</h3>

      {/* Cycle timeline bar */}
      <div className="relative h-8 rounded-full bg-muted/50 overflow-hidden mb-3">
        {/* Period phase */}
        <div
          className="absolute top-0 left-0 h-full rounded-l-full"
          style={{
            width: `${(5 / cycleLen) * 100}%`,
            background: "linear-gradient(90deg, hsl(340,75%,55%), hsl(330,80%,70%))",
            opacity: 0.4,
          }}
        />
        {/* Fertile window */}
        <div
          className="absolute top-0 h-full"
          style={{
            left: `${(fertileStart / cycleLen) * 100}%`,
            width: `${((fertileEnd - fertileStart) / cycleLen) * 100}%`,
            background: "linear-gradient(90deg, hsl(160,50%,55%), hsl(45,95%,60%))",
            opacity: 0.4,
            borderRadius: "0.5rem",
          }}
        />
        {/* Ovulation marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sunflower border-2 border-card shadow-md z-10"
          style={{ left: `${(ovulationDay / cycleLen) * 100}%`, transform: "translate(-50%, -50%)" }}
        />
        {/* Current day indicator */}
        <div
          className="absolute top-0 h-full w-1 bg-primary rounded-full shadow-lg z-20 transition-all duration-700"
          style={{ left: `${Math.min(100, (dayInCycle / cycleLen) * 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-muted-foreground font-body mb-2">
        <span>Day 1</span>
        <span>Fertile (Day {fertileStart}–{fertileEnd})</span>
        <span>Day {cycleLen}</span>
      </div>

      <div className={`text-sm font-bold rounded-2xl px-3 py-2 text-center ${isFertile ? "bg-mint/20 text-accent" : "bg-muted/30 text-muted-foreground"}`}>
        {isFertile ? "🌟 You're in your fertile window!" : `Fertile window in ~${Math.max(0, fertileStart - dayInCycle)} days`}
      </div>
    </div>
  );
};

export default FertilityWindow;
