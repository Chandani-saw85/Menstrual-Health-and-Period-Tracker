import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, addDays, getDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import AppNavbar from "@/components/AppNavbar";
import SanitaryPadAnimation from "@/components/SanitaryPadAnimation";
import { generateSampleData, predictNextPeriod, getCyclePhase, getSyncScore, CycleEntry, MoodEntry, JournalEntry, MOODS } from "@/lib/cycle-utils";
import {
  CalendarHeart, TrendingUp, Activity, Droplets,
  ChevronLeft, ChevronRight, Plus, X, Sparkles
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const sample = useMemo(() => generateSampleData(), []);
  const [cycles, setCycles] = useState<CycleEntry[]>(sample.cycles);
  const [moods] = useState<MoodEntry[]>(sample.moods);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [showLogModal, setShowLogModal] = useState(false);
  const [logDate, setLogDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const nextPeriod = predictNextPeriod(cycles);
  const { phase, day, description, icon } = getCyclePhase(cycles);
  const syncScore = getSyncScore(cycles);
  const daysUntil = nextPeriod ? Math.max(0, Math.round((nextPeriod.getTime() - Date.now()) / 86400000)) : null;

  // Calendar
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const isPeriodDay = (date: Date) =>
    cycles.some((c) => {
      const end = c.endDate || addDays(c.startDate, 5);
      return isWithinInterval(date, { start: c.startDate, end });
    });

  const isPredictedDay = (date: Date) => {
    if (!nextPeriod) return false;
    return isWithinInterval(date, { start: nextPeriod, end: addDays(nextPeriod, 4) });
  };

  const handleLogCycle = () => {
    setCycles((prev) => [...prev, { id: Date.now().toString(), startDate: new Date(logDate) }]);
    setShowLogModal(false);
  };

  const recentMoods = moods.slice(-7);
  const scoreCircumference = 2 * Math.PI * 38;
  const scoreOffset = scoreCircumference - (syncScore / 100) * scoreCircumference;

  const phaseColors: Record<string, string> = {
    Menstrual: "from-primary to-bubblegum",
    Follicular: "from-mint to-seafoam",
    Ovulation: "from-sunflower to-coral",
    Luteal: "from-lilac to-secondary",
    Unknown: "from-muted to-border",
    "Pre-Period": "from-lilac to-primary",
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Greeting */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-foreground">
              Hello, {user?.name || "Friend"}! {icon}
            </h2>
            <p className="text-muted-foreground font-body text-sm">{description}</p>
          </div>
          <button onClick={() => setShowLogModal(true)} className="btn-fun flex items-center gap-2 py-2.5 px-5 text-sm">
            <Plus className="w-4 h-4" /> Log Period
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Phase */}
          <div className="fun-card-pink relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${phaseColors[phase] || "from-primary to-secondary"} opacity-20 blur-xl -translate-y-4 translate-x-4`} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phase</span>
              </div>
              <p className="font-display text-2xl font-extrabold text-foreground">{phase}</p>
              {day > 0 && <p className="text-sm text-muted-foreground font-body">Day {day}</p>}
            </div>
          </div>

          {/* Next Period */}
          <div className="fun-card-purple relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-secondary/20 blur-xl -translate-y-4 translate-x-4" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <CalendarHeart className="w-5 h-5 text-secondary-foreground" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Next Period</span>
              </div>
              {nextPeriod ? (
                <>
                  <p className="font-display text-2xl font-extrabold text-foreground">{format(nextPeriod, "MMM d")}</p>
                  <p className="text-sm text-muted-foreground font-body">
                    {daysUntil === 0 ? "Today!" : `In ${daysUntil} days`}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground font-body">Log a cycle first</p>
              )}
            </div>
          </div>

          {/* Sync Score */}
          <div className="fun-card-mint flex items-center gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="hsl(var(--accent))" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={scoreCircumference}
                  strokeDashoffset={scoreOffset}
                  style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-lg font-extrabold text-foreground">{syncScore}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Sync</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                {syncScore >= 80 ? "Very regular! 🎯" : syncScore >= 50 ? "Moderate" : syncScore > 0 ? "Irregular" : "Need 3+ cycles"}
              </p>
            </div>
          </div>

          {/* Today's Mood */}
          <div className="fun-card-peach">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-coral" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Recent Moods</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {recentMoods.map((m) => (
                <div key={m.id} className="flex flex-col items-center">
                  <span className="text-xl">{m.mood}</span>
                  <span className="text-[9px] text-muted-foreground">{format(new Date(m.date), "EEE")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="fun-card border-primary/20">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-bold text-foreground">📅 Cycle Calendar</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCalendarMonth((m) => subMonths(m, 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <span className="font-display text-lg font-bold text-foreground min-w-[140px] text-center">
                {format(calendarMonth, "MMMM yyyy")}
              </span>
              <button onClick={() => setCalendarMonth((m) => addMonths(m, 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {daysInMonth.map((date) => {
              const isPeriod = isPeriodDay(date);
              const isPredicted = isPredictedDay(date);
              const isToday = isSameDay(date, new Date());
              const dayMood = moods.find((m) => m.date === format(date, "yyyy-MM-dd"));

              return (
                <div
                  key={date.toISOString()}
                  className={`
                    relative aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-semibold transition-all duration-200 cursor-default
                    ${isPeriod ? "bg-gradient-to-br from-primary/20 to-bubblegum/20 border-2 border-primary/30 text-primary" : ""}
                    ${isPredicted && !isPeriod ? "bg-gradient-to-br from-secondary/20 to-lilac/20 border-2 border-dashed border-secondary/40 text-secondary-foreground" : ""}
                    ${isToday && !isPeriod && !isPredicted ? "bg-accent/10 border-2 border-accent/30 text-accent-foreground" : ""}
                    ${!isPeriod && !isPredicted && !isToday ? "text-foreground hover:bg-muted/50" : ""}
                  `}
                >
                  <span className="text-xs">{format(date, "d")}</span>
                  {isPeriod && <span className="text-[8px]">🩸</span>}
                  {isPredicted && !isPeriod && <span className="text-[8px]">🔮</span>}
                  {dayMood && <span className="text-[8px]">{dayMood.mood}</span>}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-4 h-4 rounded-md bg-gradient-to-br from-primary/30 to-bubblegum/30 border border-primary/30" /> Period
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-4 h-4 rounded-md bg-gradient-to-br from-secondary/30 to-lilac/30 border border-dashed border-secondary/40" /> Predicted
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-4 h-4 rounded-md bg-accent/10 border-2 border-accent/30" /> Today
            </div>
          </div>
        </div>

        {/* Period Reminder */}
        {daysUntil !== null && daysUntil <= 3 && daysUntil >= 0 && (
          <div className="relative overflow-hidden rounded-3xl p-5 border-2 border-primary/20" style={{
            background: "linear-gradient(135deg, hsl(340,80%,92%), hsl(270,60%,92%), hsl(340,80%,95%))",
          }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-2xl animate-heartbeat">
                🔔
              </div>
              <div>
                <p className="font-display text-lg font-bold text-foreground">
                  {daysUntil === 0 ? "Period expected today!" : `Period in ${daysUntil} day${daysUntil !== 1 ? "s" : ""}!`}
                </p>
                <p className="text-sm text-muted-foreground font-body">Stock up and prepare 💕</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setShowLogModal(false)} />
          <div className="fun-card border-primary/30 max-w-sm w-full relative z-10 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl font-bold text-foreground">Log Period 🌸</h3>
              <button onClick={() => setShowLogModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Start Date</label>
            <input
              type="date" value={logDate} onChange={(e) => setLogDate(e.target.value)}
              className="w-full p-3 rounded-2xl bg-muted border-2 border-border text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
            />
            <button onClick={handleLogCycle} className="btn-fun w-full mt-4">Save 💖</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
