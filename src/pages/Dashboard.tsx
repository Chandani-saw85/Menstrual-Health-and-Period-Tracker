import { useState, useMemo, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isWithinInterval, addDays, getDay } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import AppNavbar from "@/components/AppNavbar";
import SanitaryPadAnimation from "@/components/SanitaryPadAnimation";
import DateModal from "@/components/dashboard/DateModal";
import PhaseDetailsModal from "@/components/dashboard/PhaseDetailsModal";
import FloatingActionButton from "@/components/dashboard/FloatingActionButton";
import HormoneGraph from "@/components/dashboard/HormoneGraph";
import FertilityWindow from "@/components/dashboard/FertilityWindow";
import SmartInsights from "@/components/dashboard/SmartInsights";
import { predictNextPeriod, getCyclePhase, getSyncScore, CycleEntry, MoodEntry, MOODS } from "@/lib/cycle-utils";
import { getCycles, getMoods, getSymptoms, saveCycle, saveMood, saveSymptoms, seedSampleData, SymptomEntry } from "@/lib/database";
import {
  CalendarHeart, Activity, Droplets,
  ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();

  useEffect(() => { seedSampleData(); }, []);

  const [cycles, setCycles] = useState<CycleEntry[]>(getCycles);
  const [moods, setMoods] = useState<MoodEntry[]>(getMoods);
  const [symptoms] = useState<SymptomEntry[]>(getSymptoms);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPhaseDetails, setShowPhaseDetails] = useState(false);

  const nextPeriod = predictNextPeriod(cycles);
  const { phase, day, description, icon } = getCyclePhase(cycles);
  const syncScore = getSyncScore(cycles);
  const daysUntil = nextPeriod ? Math.max(0, Math.round((nextPeriod.getTime() - Date.now()) / 86400000)) : null;

  // Calendar helpers
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

  const handleLogPeriod = (dateStr: string) => {
    const entry: CycleEntry = { id: Date.now().toString(), startDate: new Date(dateStr) };
    saveCycle(entry);
    setCycles(getCycles());
  };

  const handleLogMood = (dateStr: string, mood: string, label: string) => {
    saveMood({ id: Date.now().toString(), date: dateStr, mood, label });
    setMoods(getMoods());
  };

  const handleLogSymptoms = (dateStr: string, syms: string[]) => {
    saveSymptoms({ id: Date.now().toString(), date: dateStr, symptoms: syms });
  };

  const recentMoods = moods.slice(-7);
  const scoreCircumference = 2 * Math.PI * 38;
  const scoreOffset = scoreCircumference - (syncScore / 100) * scoreCircumference;

  // Cycle progress
  const cycleProgress = useMemo(() => {
    if (!nextPeriod || cycles.length === 0) return 0;
    const sorted = [...cycles].sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    const totalDays = Math.round((nextPeriod.getTime() - sorted[0].startDate.getTime()) / 86400000);
    const elapsed = Math.round((Date.now() - sorted[0].startDate.getTime()) / 86400000);
    return Math.min(100, Math.max(0, (elapsed / totalDays) * 100));
  }, [nextPeriod, cycles]);

  const phaseColors: Record<string, string> = {
    Menstrual: "from-primary to-bubblegum",
    Follicular: "from-mint to-seafoam",
    Ovulation: "from-sunflower to-coral",
    Luteal: "from-lilac to-secondary",
    Unknown: "from-muted to-border",
    "Pre-Period": "from-lilac to-primary",
  };

  // Mini month calendars for previous months
  const prevMonths = [1, 2, 3, 4].map((n) => subMonths(new Date(), n));

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10" style={{
        background: "linear-gradient(135deg, hsl(340,80%,96%), hsl(270,60%,95%), hsl(200,60%,96%), hsl(25,90%,96%))",
        backgroundSize: "400% 400%",
        animation: "gradientFlow 15s ease infinite",
      }} />

      <style>{`
        @keyframes gradientFlow {
          0%, 100% { background-position: 0% 50%; }
          25% { background-position: 100% 0%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
        }
      `}</style>

      <AppNavbar />

      <main className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Hero Greeting with Pad Animation */}
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
          style={{
            background: "linear-gradient(135deg, hsla(340,80%,92%,0.8), hsla(270,60%,92%,0.8), hsla(340,80%,95%,0.8))",
            backdropFilter: "blur(12px)",
            border: "2px solid hsla(340,60%,88%,0.5)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="z-10">
              <h2 className="font-display text-3xl md:text-4xl font-extrabold text-foreground">
                Hello, {user?.name || "Friend"}! {icon}
              </h2>
              <p className="text-muted-foreground font-body text-sm mt-1">{description}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {phase} Phase
                </span>
                {day > 0 && (
                  <span className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-bold border border-secondary/20">
                    Day {day}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden sm:block opacity-80">
              <SanitaryPadAnimation size="md" />
            </div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl animate-blob-morph" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-secondary/10 blur-3xl animate-blob-morph" style={{ animationDelay: "2s" }} />
        </div>

        {/* Interactive Calendar */}
        <div className="fun-card border-primary/20"
          style={{
            background: "hsla(0,0%,100%,0.85)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-bold text-foreground">📅 Cycle Calendar</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setCalendarMonth((m) => subMonths(m, 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:scale-110 transition-all">
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <span className="font-display text-lg font-bold text-foreground min-w-[140px] text-center">
                {format(calendarMonth, "MMMM yyyy")}
              </span>
              <button onClick={() => setCalendarMonth((m) => addMonths(m, 1))} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:scale-110 transition-all">
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-xs font-bold text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`e-${i}`} />)}
            {daysInMonth.map((date) => {
              const isPeriod = isPeriodDay(date);
              const isPredicted = isPredictedDay(date);
              const isToday = isSameDay(date, new Date());
              const dayMood = moods.find((m) => m.date === format(date, "yyyy-MM-dd"));
              const daySymptom = symptoms.find((s) => s.date === format(date, "yyyy-MM-dd"));

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    relative aspect-square rounded-2xl flex flex-col items-center justify-center text-sm font-semibold
                    transition-all duration-200 cursor-pointer group
                    hover:scale-110 hover:shadow-lg hover:z-10
                    ${isPeriod ? "bg-gradient-to-br from-primary/20 to-bubblegum/20 border-2 border-primary/30 text-primary" : ""}
                    ${isPredicted && !isPeriod ? "bg-gradient-to-br from-secondary/20 to-lilac/20 border-2 border-dashed border-secondary/40 text-secondary-foreground" : ""}
                    ${isToday && !isPeriod && !isPredicted ? "bg-accent/10 border-2 border-accent/30 text-accent-foreground ring-2 ring-accent/20" : ""}
                    ${!isPeriod && !isPredicted && !isToday ? "text-foreground hover:bg-muted/50 border border-transparent hover:border-primary/10" : ""}
                  `}
                >
                  <span className="text-xs">{format(date, "d")}</span>
                  <div className="flex gap-px">
                    {isPeriod && <span className="text-[7px]">🩸</span>}
                    {isPredicted && !isPeriod && <span className="text-[7px]">🔮</span>}
                    {dayMood && <span className="text-[7px]">{dayMood.mood}</span>}
                    {daySymptom && <span className="text-[7px]">💊</span>}
                  </div>
                  {/* Hover glow */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: "0 0 15px 2px hsla(340,75%,55%,0.15)" }} />
                </button>
              );
            })}
          </div>

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
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-xs">💊</span> Symptoms logged
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Current Phase */}
          <button onClick={() => setShowPhaseDetails(true)} className="text-left fun-card-pink relative overflow-hidden group cursor-pointer">
            <div className={`absolute top-0 right-0 w-20 h-20 rounded-full bg-gradient-to-br ${phaseColors[phase] || "from-primary to-secondary"} opacity-20 blur-xl -translate-y-4 translate-x-4 group-hover:opacity-40 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-5 h-5 text-primary" />
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Phase</span>
              </div>
              <p className="font-display text-2xl font-extrabold text-foreground">{phase}</p>
              {day > 0 && <p className="text-sm text-muted-foreground font-body">Day {day}</p>}
              <p className="text-xs text-primary mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click for details →</p>
            </div>
          </button>

          {/* Next Period with progress bar */}
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
                  {/* Progress bar */}
                  <div className="mt-2 h-2 rounded-full bg-muted/50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-secondary to-lilac transition-all duration-1000"
                      style={{ width: `${cycleProgress}%` }}
                    />
                  </div>
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

          {/* Recent Moods */}
          <div className="fun-card-peach">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-coral" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Recent Moods</span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {recentMoods.map((m) => (
                <div key={m.id} className="flex flex-col items-center group cursor-default">
                  <span className="text-xl group-hover:scale-125 group-hover:animate-wiggle transition-transform">{m.mood}</span>
                  <span className="text-[9px] text-muted-foreground">{format(new Date(m.date), "EEE")}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Hormone Graph + Fertility Window */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <HormoneGraph />
          <FertilityWindow cycles={cycles} />
        </div>

        {/* Smart Insights + Mini Month Calendars */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <SmartInsights cycles={cycles} />
          </div>

          {/* Previous months mini calendars */}
          <div className="lg:col-span-2">
            <div className="fun-card border-lilac/20" style={{ background: "hsla(0,0%,100%,0.85)", backdropFilter: "blur(12px)" }}>
              <h3 className="font-display text-lg font-bold text-foreground mb-4">📆 Previous Months</h3>
              <div className="grid grid-cols-2 gap-3">
                {prevMonths.map((month) => {
                  const mStart = startOfMonth(month);
                  const mEnd = endOfMonth(month);
                  const mDays = eachDayOfInterval({ start: mStart, end: mEnd });
                  const mStartDay = getDay(mStart);

                  return (
                    <div key={month.toISOString()} className="rounded-2xl p-3 bg-muted/20 border border-border/50">
                      <p className="text-xs font-bold text-foreground mb-2 text-center">{format(month, "MMM yyyy")}</p>
                      <div className="grid grid-cols-7 gap-px">
                        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                          <div key={`${d}-${i}`} className="text-center text-[8px] text-muted-foreground font-bold">{d}</div>
                        ))}
                        {Array.from({ length: mStartDay }).map((_, i) => <div key={`me-${i}`} />)}
                        {mDays.map((date) => {
                          const isPeriod = isPeriodDay(date);
                          return (
                            <div
                              key={date.toISOString()}
                              className={`text-center text-[9px] rounded-full aspect-square flex items-center justify-center
                                ${isPeriod ? "bg-primary/20 text-primary font-bold" : "text-muted-foreground"}`}
                            >
                              {format(date, "d")}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Period Reminder */}
        {daysUntil !== null && daysUntil <= 3 && daysUntil >= 0 && (
          <div className="relative overflow-hidden rounded-3xl p-5 border-2 border-primary/20 animate-gentle-pulse" style={{
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

      {/* Floating Action Button */}
      <FloatingActionButton
        onLogPeriod={() => setSelectedDate(new Date())}
        onLogMood={() => setSelectedDate(new Date())}
        onLogSymptoms={() => setSelectedDate(new Date())}
      />

      {/* Date Modal */}
      {selectedDate && (
        <DateModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onLogPeriod={handleLogPeriod}
          onLogMood={handleLogMood}
          onLogSymptoms={handleLogSymptoms}
          existingMood={moods.find((m) => m.date === format(selectedDate, "yyyy-MM-dd"))?.mood}
          existingSymptoms={symptoms.find((s) => s.date === format(selectedDate, "yyyy-MM-dd"))?.symptoms}
          isPeriodDay={isPeriodDay(selectedDate)}
        />
      )}

      {/* Phase Details Modal */}
      {showPhaseDetails && (
        <PhaseDetailsModal
          onClose={() => setShowPhaseDetails(false)}
          cycles={cycles}
        />
      )}
    </div>
  );
};

export default Dashboard;
